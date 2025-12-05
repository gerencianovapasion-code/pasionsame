import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['USER', 'MODEL']),

  // Campos opcionales para modelos
  username: z.string().min(3).optional(),
  displayName: z.string().min(2).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'TRANS']).optional(),
  countryId: z.string().optional(),
  provinceId: z.string().optional(),
  city: z.string().optional(),
  age: z.number().min(18).max(100).optional(),
  phone: z.string().optional(),
  bio: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Si es modelo, verificar que el username sea único
    if (validatedData.role === 'MODEL' && validatedData.username) {
      const existingModel = await prisma.model.findUnique({
        where: { username: validatedData.username },
      });

      if (existingModel) {
        return NextResponse.json(
          { error: 'Este nombre de usuario ya está en uso' },
          { status: 400 }
        );
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        emailVerified: false,
      },
    });

    // Si es modelo, crear el perfil de modelo
    if (validatedData.role === 'MODEL' && validatedData.username) {
      await prisma.model.create({
        data: {
          userId: user.id,
          username: validatedData.username,
          displayName: validatedData.displayName || validatedData.username,
          gender: validatedData.gender || 'FEMALE',
          countryId: validatedData.countryId || '',
          provinceId: validatedData.provinceId,
          city: validatedData.city,
          age: validatedData.age,
          phone: validatedData.phone,
          bio: validatedData.bio,
          membershipType: 'FREE',
          languages: JSON.stringify(['es']),
        },
      });
    }

    // TODO: Enviar email de verificación
    // await sendVerificationEmail(user.email);

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
