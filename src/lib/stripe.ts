import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Crear cliente de Stripe para el cliente
export async function getStripeCustomerId(userId: string, email: string): Promise<string> {
  const { prisma } = await import('@/lib/db/prisma');

  // Buscar si el usuario ya tiene un customerId de Stripe
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Si ya tiene customerId, retornarlo
  if (user && user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Crear nuevo customer en Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  // Guardar el customerId en la base de datos
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// Crear suscripción
export async function createSubscription(
  customerId: string,
  priceId: string,
  modelId: string
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      modelId,
    },
  });

  return subscription;
}

// Crear producto y precio para un modelo
export async function createModelPricing(modelId: string, modelName: string, price: number) {
  // Crear producto
  const product = await stripe.products.create({
    name: `Suscripción a ${modelName}`,
    description: `Acceso mensual al contenido exclusivo de ${modelName}`,
    metadata: {
      modelId,
    },
  });

  // Crear precio
  const stripePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(price * 100), // Convertir a centavos
    currency: 'eur',
    recurring: {
      interval: 'month',
    },
    metadata: {
      modelId,
    },
  });

  return { productId: product.id, priceId: stripePrice.id };
}

// Crear pago único (pay-per-view)
export async function createPaymentIntent(
  customerId: string,
  amount: number,
  description: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customerId,
    amount: Math.round(amount * 100), // Convertir a centavos
    currency: 'eur',
    description,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

// Calcular comisión de la plataforma (20%)
export function calculatePlatformFee(amount: number): { platformFee: number; netAmount: number } {
  const platformFee = amount * 0.2;
  const netAmount = amount - platformFee;
  return { platformFee, netAmount };
}
