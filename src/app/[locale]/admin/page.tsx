import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, UserCheck, Eye } from 'lucide-react';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/login`);
  }

  // Obtener estadísticas
  const [
    totalUsers,
    totalModels,
    totalEarnings,
    pendingVerifications,
    pendingWithdrawals,
    activeSubscriptions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.model.count(),
    prisma.transaction.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { platformFee: true },
    }),
    prisma.model.count({ where: { isVerified: false, verificationDoc: { not: null } } }),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    prisma.subscription.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona tu plataforma multi-sitio</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-gray-600 mt-1">Usuarios registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modelos</CardTitle>
              <UserCheck className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalModels}</div>
              <p className="text-xs text-gray-600 mt-1">Creadores activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Plataforma</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{(totalEarnings._sum.platformFee || 0).toFixed(2)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Comisión 20%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
              <Eye className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubscriptions}</div>
              <p className="text-xs text-gray-600 mt-1">Usuarios suscritos</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Pendientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Verificaciones Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingVerifications}</div>
              <p className="text-sm text-gray-600 mt-2">Modelos esperando verificación</p>
              <a
                href={`/${locale}/admin/verifications`}
                className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-medium"
              >
                Ver pendientes →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retiros Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingWithdrawals}</div>
              <p className="text-sm text-gray-600 mt-2">Solicitudes de retiro</p>
              <a
                href={`/${locale}/admin/withdrawals`}
                className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-medium"
              >
                Gestionar retiros →
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Enlaces Rápidos */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`/${locale}/admin/models`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Gestionar Modelos</h3>
            <p className="text-sm text-gray-600">
              Ver, editar y gestionar todos los modelos de la plataforma
            </p>
          </a>

          <a
            href={`/${locale}/admin/users`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Gestionar Usuarios</h3>
            <p className="text-sm text-gray-600">
              Administrar cuentas de usuarios y permisos
            </p>
          </a>

          <a
            href={`/${locale}/admin/settings`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Configuración</h3>
            <p className="text-sm text-gray-600">
              Ajustes generales, pasarelas de pago y más
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
