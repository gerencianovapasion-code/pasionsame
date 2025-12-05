import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { postId } = await context.params;

    // Verificar si ya dio like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      // Quitar like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      // Decrementar contador
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });

      return NextResponse.json({ liked: false });
    }

    // Dar like
    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });

    // Incrementar contador
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });

    // Crear notificación para el modelo
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { model: true },
    });

    if (post) {
      await prisma.notification.create({
        data: {
          userId: post.model.userId,
          type: 'new_like',
          title: 'Nuevo like',
          message: `A alguien le gustó tu publicación`,
          link: `/models/${post.model.username}`,
        },
      });
    }

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error('Error al procesar like:', error);
    return NextResponse.json({ error: 'Error al procesar like' }, { status: 500 });
  }
}
