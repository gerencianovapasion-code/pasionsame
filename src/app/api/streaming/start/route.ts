import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const startStreamSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  pricePerView: z.number().min(0).default(0),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'MODEL') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = startStreamSchema.parse(body);

    // Obtener modelo
    const model = await prisma.model.findUnique({
      where: { userId: session.user.id },
    });

    if (!model) {
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    // Verificar membresía
    if (model.membershipType === 'FREE') {
      return NextResponse.json(
        { error: 'Necesitas una membresía de pago para hacer streaming' },
        { status: 400 }
      );
    }

    // Generar stream key único
    const streamKey = `stream_${model.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // URL del servidor RTMP (configurar según tu servidor)
    const streamUrl = `${process.env.STREAMING_SERVER || 'rtmp://localhost/live'}/${streamKey}`;

    // Crear stream en BD
    const stream = await prisma.stream.create({
      data: {
        modelId: model.id,
        title: validatedData.title,
        description: validatedData.description,
        pricePerView: validatedData.pricePerView,
        streamKey,
        streamUrl,
        isLive: false, // Se activará cuando el modelo empiece a transmitir
      },
    });

    return NextResponse.json({
      stream,
      streamKey,
      streamUrl,
      instructions: {
        server: process.env.STREAMING_SERVER || 'rtmp://localhost/live',
        streamKey,
        software: 'OBS Studio, Streamlabs OBS, o similar',
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error al iniciar stream:', error);
    return NextResponse.json({ error: 'Error al iniciar stream' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'MODEL') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const model = await prisma.model.findUnique({
      where: { userId: session.user.id },
    });

    if (!model) {
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    // Obtener streams del modelo
    const streams = await prisma.stream.findMany({
      where: { modelId: model.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json(streams);
  } catch (error) {
    console.error('Error al obtener streams:', error);
    return NextResponse.json({ error: 'Error al obtener streams' }, { status: 500 });
  }
}
