import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const createWithdrawalSchema = z.object({
  modelId: z.string(),
  amount: z.number().min(50, 'El mínimo es €50'),
  method: z.enum(['paypal', 'bank_transfer']),
  details: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'MODEL') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createWithdrawalSchema.parse(body);

    // Verificar que el modelo pertenece al usuario
    const model = await prisma.model.findUnique({
      where: { id: validatedData.modelId },
    });

    if (!model || model.userId !== session.user.id) {
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    // Verificar balance disponible
    if (Number(model.totalEarnings) < validatedData.amount) {
      return NextResponse.json(
        { error: 'Balance insuficiente' },
        { status: 400 }
      );
    }

    const minimumWithdrawal = Number(process.env.MINIMUM_WITHDRAWAL) || 50;
    if (validatedData.amount < minimumWithdrawal) {
      return NextResponse.json(
        { error: `El mínimo para retiro es €${minimumWithdrawal}` },
        { status: 400 }
      );
    }

    // Crear solicitud de retiro
    const withdrawal = await prisma.withdrawal.create({
      data: {
        modelId: validatedData.modelId,
        amount: validatedData.amount,
        method: validatedData.method,
        details: validatedData.details,
        status: 'PENDING',
      },
    });

    // Descontar del balance del modelo (se revertirá si se rechaza)
    await prisma.model.update({
      where: { id: validatedData.modelId },
      data: {
        totalEarnings: {
          decrement: validatedData.amount,
        },
      },
    });

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error al crear retiro:', error);
    return NextResponse.json({ error: 'Error al crear retiro' }, { status: 500 });
  }
}
