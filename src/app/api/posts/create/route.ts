import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const createPostSchema = z.object({
  content: z.string().min(1).max(10000),
  isPremium: z.boolean().default(false),
  price: z.number().min(0).optional(),
  mediaUrls: z.array(z.string()).optional(),
});

// Límites por membresía
const MEMBERSHIP_LIMITS = {
  FREE: { postsPerDay: 3, maxPhotos: 10, maxVideos: 5, maxVideoDuration: 0 },
  BRONZE: { postsPerDay: 5, maxPhotos: 20, maxVideos: 20, maxVideoDuration: 60 },
  SILVER: { postsPerDay: 10, maxPhotos: 40, maxVideos: 40, maxVideoDuration: 120 },
  GOLD: { postsPerDay: 20, maxPhotos: 80, maxVideos: 80, maxVideoDuration: 180 },
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'MODEL') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createPostSchema.parse(body);

    // Obtener modelo
    const model = await prisma.model.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            posts: true,
            media: true,
          },
        },
      },
    });

    if (!model) {
      return NextResponse.json({ error: 'Modelo no encontrado' }, { status: 404 });
    }

    // Verificar límites de membresía
    const limits = MEMBERSHIP_LIMITS[model.membershipType];

    // Verificar posts por día
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postsToday = await prisma.post.count({
      where: {
        modelId: model.id,
        createdAt: {
          gte: today,
        },
      },
    });

    if (postsToday >= limits.postsPerDay) {
      return NextResponse.json(
        {
          error: `Has alcanzado el límite de ${limits.postsPerDay} posts por día para tu membresía ${model.membershipType}`,
        },
        { status: 400 }
      );
    }

    // Verificar que los posts premium solo estén disponibles para membresías de pago
    if (validatedData.isPremium && model.membershipType === 'FREE') {
      return NextResponse.json(
        { error: 'Necesitas una membresía de pago para publicar contenido premium' },
        { status: 400 }
      );
    }

    // Crear post
    const post = await prisma.post.create({
      data: {
        modelId: model.id,
        content: validatedData.content,
        isPremium: validatedData.isPremium,
        price: validatedData.isPremium ? validatedData.price : null,
      },
      include: {
        model: {
          select: {
            username: true,
            displayName: true,
            profileImage: true,
            membershipType: true,
          },
        },
      },
    });

    // Si hay medios, crearlos
    if (validatedData.mediaUrls && validatedData.mediaUrls.length > 0) {
      await prisma.media.createMany({
        data: validatedData.mediaUrls.map((url) => ({
          modelId: model.id,
          postId: post.id,
          url,
          type: 'IMAGE', // Detectar tipo automáticamente en producción
          isPremium: validatedData.isPremium,
          price: validatedData.isPremium ? validatedData.price : null,
        })),
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error al crear post:', error);
    return NextResponse.json({ error: 'Error al crear post' }, { status: 500 });
  }
}

// Obtener posts del feed
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const modelId = searchParams.get('modelId');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '20');

    const where = modelId ? { modelId } : {};

    const posts = await prisma.post.findMany({
      where,
      include: {
        model: {
          select: {
            username: true,
            displayName: true,
            profileImage: true,
            membershipType: true,
            isVerified: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.post.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return NextResponse.json({ error: 'Error al obtener posts' }, { status: 500 });
  }
}
