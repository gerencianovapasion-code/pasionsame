import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
});

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
    const body = await req.json();
    const { content } = commentSchema.parse(body);

    // Crear comentario
    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        postId,
        content,
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    // Incrementar contador
    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
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
          type: 'new_comment',
          title: 'Nuevo comentario',
          message: `Alguien comentó en tu publicación`,
          link: `/models/${post.model.username}`,
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error al crear comentario:', error);
    return NextResponse.json({ error: 'Error al crear comentario' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            model: {
              select: {
                displayName: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 });
  }
}
