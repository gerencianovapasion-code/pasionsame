import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoiceFailed(invoice);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Actualizar suscripción después de checkout exitoso
  if (session.subscription && typeof session.subscription === 'string') {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.subscription },
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { isActive: true },
      });
    }
  }
}

async function handleSubscriptionUpdate(stripeSubscription: Stripe.Subscription) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSubscription.id },
    include: { model: true },
  });

  if (!subscription) return;

  const isActive = stripeSubscription.status === 'active';
  const currentPeriodEnd = (stripeSubscription as any).current_period_end;
  const endDate = new Date(currentPeriodEnd * 1000);

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      isActive,
      endDate,
    },
  });

  // Actualizar contador de suscriptores del modelo
  if (isActive) {
    await prisma.model.update({
      where: { id: subscription.modelId },
      data: { totalSubscribers: { increment: 1 } },
    });
  }
}

async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSubscription.id },
  });

  if (!subscription) return;

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      isActive: false,
      autoRenew: false,
    },
  });

  // Decrementar contador de suscriptores
  await prisma.model.update({
    where: { id: subscription.modelId },
    data: { totalSubscribers: { decrement: 1 } },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Registrar transacción
  const invoiceSubscription = (invoice as any).subscription;
  if (invoiceSubscription && typeof invoiceSubscription === 'string') {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoiceSubscription },
      include: { user: true, model: true },
    });

    if (subscription) {
      const amountPaid = (invoice as any).amount_paid || 0;
      const amount = amountPaid / 100; // Convertir de centavos a euros
      const platformFee = amount * 0.2;
      const netAmount = amount - platformFee;

      const paymentIntent = (invoice as any).payment_intent;

      // Crear transacción
      await prisma.transaction.create({
        data: {
          userId: subscription.userId,
          modelId: subscription.modelId,
          type: 'SUBSCRIPTION',
          status: 'COMPLETED',
          amount,
          platformFee,
          netAmount,
          currency: 'EUR',
          stripePaymentId: paymentIntent as string,
          description: `Suscripción mensual a ${subscription.model.displayName}`,
        },
      });

      // Actualizar ganancias del modelo
      await prisma.model.update({
        where: { id: subscription.modelId },
        data: { totalEarnings: { increment: netAmount } },
      });

      // Crear notificación para el modelo
      await prisma.notification.create({
        data: {
          userId: subscription.model.userId,
          type: 'new_subscriber',
          title: 'Nuevo pago de suscripción',
          message: `Has recibido €${netAmount.toFixed(2)} de ${subscription.user.email}`,
          link: `/dashboard/earnings`,
        },
      });
    }
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  // Notificar al usuario sobre el fallo
  const invoiceSubscription = (invoice as any).subscription;
  if (invoiceSubscription && typeof invoiceSubscription === 'string') {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoiceSubscription },
    });

    if (subscription) {
      await prisma.notification.create({
        data: {
          userId: subscription.userId,
          type: 'payment_failed',
          title: 'Pago fallido',
          message: 'No pudimos procesar tu pago. Por favor actualiza tu método de pago.',
          link: '/settings/payment',
        },
      });
    }
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Manejar pagos únicos (PPV)
  const metadata = paymentIntent.metadata;

  if (metadata.type === 'ppv' && metadata.postId) {
    const amount = paymentIntent.amount / 100;
    const platformFee = amount * 0.2;
    const netAmount = amount - platformFee;

    // Registrar compra
    await prisma.purchase.create({
      data: {
        userId: metadata.userId,
        postId: metadata.postId,
        amount,
        currency: 'EUR',
      },
    });

    // Registrar transacción
    await prisma.transaction.create({
      data: {
        userId: metadata.userId,
        modelId: metadata.modelId,
        type: 'PURCHASE',
        status: 'COMPLETED',
        amount,
        platformFee,
        netAmount,
        currency: 'EUR',
        stripePaymentId: paymentIntent.id,
        description: metadata.description || 'Compra de contenido',
      },
    });

    // Actualizar ganancias del modelo
    await prisma.model.update({
      where: { id: metadata.modelId },
      data: { totalEarnings: { increment: netAmount } },
    });
  }
}
