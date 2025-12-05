import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { stripe, getStripeCustomerId, createSubscription, createModelPricing } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { modelId } = await req.json();

    // Obtener información del modelo
    const model = await prisma.model.findUnique({
      where: { id: modelId },
      include: { user: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    // Verificar que el usuario no esté ya suscrito
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_modelId: {
          userId: session.user.id,
          modelId,
        },
      },
    });

    if (existingSubscription && existingSubscription.isActive) {
      return NextResponse.json(
        { error: 'Ya estás suscrito a este modelo' },
        { status: 400 }
      );
    }

    // Obtener o crear customer de Stripe
    const customerId = await getStripeCustomerId(session.user.id, session.user.email!);

    // Si el modelo no tiene producto/precio en Stripe, crearlo
    let priceId = model.stripePriceId;
    if (!priceId) {
      const { productId, priceId: newPriceId } = await createModelPricing(
        model.id,
        model.displayName,
        Number(model.subscriptionPrice)
      );

      // Actualizar modelo con IDs de Stripe
      await prisma.model.update({
        where: { id: model.id },
        data: {
          stripeProductId: productId,
          stripePriceId: newPriceId,
        },
      });

      priceId = newPriceId;
    }

    // Crear suscripción en Stripe
    const stripeSubscription = await createSubscription(customerId, priceId!, model.id);

    const latestInvoice = stripeSubscription.latest_invoice as { payment_intent?: { client_secret?: string } };
    const paymentIntent = latestInvoice?.payment_intent;

    // Crear suscripción en nuestra base de datos (pendiente hasta que se confirme el pago)
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        modelId,
        price: model.subscriptionPrice,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        autoRenew: true,
        isActive: false, // Se activará cuando se confirme el pago
        stripeSubscriptionId: stripeSubscription.id,
      },
    });

    return NextResponse.json({
      subscription,
      clientSecret: paymentIntent?.client_secret,
      subscriptionId: stripeSubscription.id,
    });
  } catch (error) {
    console.error('Error al crear suscripción:', error);
    return NextResponse.json(
      { error: 'Error al crear suscripción' },
      { status: 500 }
    );
  }
}

// Cancelar suscripción
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'ID de suscripción requerido' }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || subscription.userId !== session.user.id) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
    }

    // Cancelar en Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    // Actualizar en base de datos
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        isActive: false,
        autoRenew: false,
      },
    });

    return NextResponse.json({ message: 'Suscripción cancelada' });
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    return NextResponse.json(
      { error: 'Error al cancelar suscripción' },
      { status: 500 }
    );
  }
}
