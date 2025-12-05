import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ withdrawalId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { withdrawalId } = await context.params;
    const { action, notes } = await req.json();

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { model: { include: { user: true } } },
    });

    if (!withdrawal) {
      return NextResponse.json({ error: 'Retiro no encontrado' }, { status: 404 });
    }

    let newStatus: 'APPROVED' | 'REJECTED' | 'PAID' = 'APPROVED';
    let notificationMessage = '';

    switch (action) {
      case 'approve':
        newStatus = 'APPROVED';
        notificationMessage = 'Tu solicitud de retiro ha sido aprobada';
        break;
      case 'reject':
        newStatus = 'REJECTED';
        notificationMessage = 'Tu solicitud de retiro ha sido rechazada';
        break;
      case 'mark-paid':
        newStatus = 'PAID';
        notificationMessage = `Tu retiro de €${withdrawal.amount.toFixed(2)} ha sido procesado`;
        break;
      default:
        return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
    }

    // Actualizar retiro
    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: newStatus,
        notes: notes || withdrawal.notes,
        processedAt: newStatus === 'PAID' ? new Date() : null,
      },
    });

    // Crear notificación para el modelo
    await prisma.notification.create({
      data: {
        userId: withdrawal.model.userId,
        type: 'withdrawal_update',
        title: 'Actualización de retiro',
        message: notificationMessage,
        link: '/dashboard/withdrawals',
      },
    });

    return NextResponse.json(updatedWithdrawal);
  } catch (error) {
    console.error('Error al actualizar retiro:', error);
    return NextResponse.json({ error: 'Error al actualizar retiro' }, { status: 500 });
  }
}
