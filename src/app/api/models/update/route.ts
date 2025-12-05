import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const updateModelSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().max(1000).optional(),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  city: z.string().optional(),
  provinceId: z.string().optional(),
  phone: z.string().optional(),
  languages: z.array(z.string()).optional(),
  subscriptionPrice: z.number().min(10).max(999).optional(),
  schedule: z.string().optional(),
  availability: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'MODEL') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateModelSchema.parse(body);

    // Obtener el modelo del usuario
    const model = await prisma.model.findUnique({
      where: { userId: session.user.id },
    });

    if (!model) {
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    // Actualizar modelo
    const updatedModel = await prisma.model.update({
      where: { id: model.id },
      data: {
        ...validatedData,
        languages: validatedData.languages
          ? JSON.stringify(validatedData.languages)
          : undefined,
      },
    });

    return NextResponse.json(updatedModel, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error al actualizar modelo:', error);
    return NextResponse.json({ error: 'Error al actualizar modelo' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const model = await prisma.model.findUnique({
      where: { userId: session.user.id },
      include: {
        country: true,
        province: true,
        _count: {
          select: {
            posts: true,
            media: true,
            subscriptions: true,
          },
        },
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error al obtener modelo:', error);
    return NextResponse.json({ error: 'Error al obtener modelo' }, { status: 500 });
  }
}
