'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { countries } from '@/data/countries';

const modelRegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  gender: z.enum(['MALE', 'FEMALE', 'TRANS']),
  countryId: z.string().min(1, 'Selecciona un país'),
  provinceId: z.string().optional(),
  city: z.string().min(2, 'La ciudad es requerida'),
  age: z.number().min(18, 'Debes ser mayor de 18 años').max(100),
  phone: z.string().optional(),
  bio: z.string().max(1000, 'La biografía no puede exceder 1000 caracteres').optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ModelRegisterFormData = z.infer<typeof modelRegisterSchema>;

export function ModelRegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ModelRegisterFormData>({
    resolver: zodResolver(modelRegisterSchema),
  });

  const selectedCountryData = countries.find((c) => c.code === selectedCountry);

  const onSubmit = async (data: ModelRegisterFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'MODEL',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Error al registrar');
        return;
      }

      // Redirigir al login
      router.push(`/${locale}/login?registered=true`);
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="md:col-span-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="mt-1"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Nombre de usuario */}
        <div className="md:col-span-2">
          <Label htmlFor="username">Nombre de Usuario *</Label>
          <Input
            id="username"
            {...register('username')}
            className="mt-1"
            placeholder="nombre_usuario"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Este será tu URL: /models/nombre_usuario
          </p>
        </div>

        {/* Nombre para mostrar */}
        <div className="md:col-span-2">
          <Label htmlFor="displayName">Nombre para Mostrar *</Label>
          <Input
            id="displayName"
            {...register('displayName')}
            className="mt-1"
            placeholder="Tu Nombre Artístico"
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <Label htmlFor="password">Contraseña *</Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="mt-1"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Género */}
        <div>
          <Label>Género *</Label>
          <Select onValueChange={(value) => setValue('gender', value as any)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Hombre</SelectItem>
              <SelectItem value="FEMALE">Mujer</SelectItem>
              <SelectItem value="TRANS">Trans</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Edad */}
        <div>
          <Label htmlFor="age">Edad *</Label>
          <Input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="mt-1"
            placeholder="18"
            min="18"
            max="100"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        {/* País */}
        <div>
          <Label>País *</Label>
          <Select
            onValueChange={(value) => {
              setValue('countryId', value);
              setSelectedCountry(value);
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecciona país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.countryId && (
            <p className="mt-1 text-sm text-red-600">{errors.countryId.message}</p>
          )}
        </div>

        {/* Provincia */}
        {selectedCountryData && (
          <div>
            <Label>Provincia</Label>
            <Select onValueChange={(value) => setValue('provinceId', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona provincia" />
              </SelectTrigger>
              <SelectContent>
                {selectedCountryData.provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Ciudad */}
        <div className={selectedCountryData ? 'md:col-span-1' : 'md:col-span-2'}>
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            {...register('city')}
            className="mt-1"
            placeholder="Tu ciudad"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="md:col-span-2">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className="mt-1"
            placeholder="+34 600 000 000"
          />
        </div>

        {/* Biografía */}
        <div className="md:col-span-2">
          <Label htmlFor="bio">Biografía (opcional)</Label>
          <textarea
            id="bio"
            {...register('bio')}
            className="mt-1 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
            rows={4}
            placeholder="Cuéntanos sobre ti..."
            maxLength={1000}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{watch('bio')?.length || 0}/1000</p>
        </div>

        {/* Términos */}
        <div className="md:col-span-2">
          <div className="flex items-start">
            <input
              id="acceptTerms"
              type="checkbox"
              {...register('acceptTerms')}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
              Acepto los{' '}
              <a href={`/${locale}/terms`} className="text-pink-600 hover:text-pink-500">
                términos y condiciones
              </a>{' '}
              y confirmo que soy mayor de 18 años
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3"
      >
        {isLoading ? 'Registrando...' : 'Crear Cuenta de Creador'}
      </Button>
    </form>
  );
}
