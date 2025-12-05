import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const startCallSchema = z.object({
  modelId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { modelId } = startCallSchema.parse(body);

    // Obtener modelo
    const model = await prisma.model.findUnique({
      where: { id: modelId },
      include: { user: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    // Verificar que el modelo esté online
    if (!model.isOnline) {
      return NextResponse.json(
        { error: 'El modelo no está disponible en este momento' },
        { status: 400 }
      );
    }

    // Verificar membresía del modelo
    if (model.membershipType === 'FREE') {
      return NextResponse.json(
        { error: 'Este modelo no tiene videollamadas habilitadas' },
        { status: 400 }
      );
    }

    // Verificar suscripción o balance del usuario
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_modelId: {
          userId: session.user.id,
          modelId,
        },
      },
    });

    const isSubscribed = subscription?.isActive || false;

    // Crear registro de videollamada
    const videoCall = await prisma.videoCall.create({
      data: {
        modelId,
        userId: session.user.id,
        pricePerMinute: model.subscriptionPrice, // O un precio específico para videollamadas
        duration: 0,
        totalAmount: 0,
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      callId: videoCall.id,
      modelId: model.id,
      modelName: model.displayName,
      modelUserId: model.userId,
      pricePerMinute: videoCall.pricePerMinute,
      isSubscribed,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error al iniciar videollamada:', error);
    return NextResponse.json({ error: 'Error al iniciar videollamada' }, { status: 500 });
  }
}
