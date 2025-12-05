import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Eye, TrendingUp, Upload, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function ModelDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session || session.user.role !== 'MODEL') {
    redirect(`/${locale}/login`);
  }

  // Obtener modelo y estadísticas
  const model = await prisma.model.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          posts: true,
          media: true,
          subscriptions: { where: { isActive: true } },
        },
      },
    },
  });

  if (!model) {
    redirect(`/${locale}/register/model`);
  }

  // Obtener estadísticas del último mes
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [monthlyEarnings, totalViews, recentTransactions] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        modelId: model.id,
        status: 'COMPLETED',
        createdAt: { gte: lastMonth },
      },
      _sum: { netAmount: true },
    }),
    prisma.post.aggregate({
      where: { modelId: model.id },
      _sum: { likesCount: true },
    }),
    prisma.transaction.findMany({
      where: { modelId: model.id },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const membershipBadges = {
    FREE: 'bg-gray-100 text-gray-800',
    BRONZE: 'bg-orange-100 text-orange-800',
    SILVER: 'bg-gray-200 text-gray-800',
    GOLD: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido, {model.displayName}
            </h1>
            <p className="text-gray-600 mt-2">Gestiona tu contenido y ganancias</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${membershipBadges[model.membershipType]}`}>
                {model.membershipType}
              </span>
              {model.isVerified && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  ✓ Verificado
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/models/${model.username}`}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Perfil
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-pink-600 to-rose-600">
              <Link href={`/${locale}/dashboard/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Link>
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{model.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">
                Este mes: €{(monthlyEarnings._sum.netAmount || 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscriptores Activos</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{model._count.subscriptions}</div>
              <p className="text-xs text-gray-600 mt-1">
                €{(model._count.subscriptions * Number(model.subscriptionPrice)).toFixed(2)}/mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contenido Publicado</CardTitle>
              <Upload className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{model._count.posts}</div>
              <p className="text-xs text-gray-600 mt-1">
                {model._count.media} archivos multimedia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Likes</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews._sum.likesCount || 0}</div>
              <p className="text-xs text-gray-600 mt-1">En todas tus publicaciones</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link href={`/${locale}/dashboard/post/new`} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Crear Publicación</h3>
                    <p className="text-sm text-gray-600">
                      Comparte contenido con tus suscriptores
                    </p>
                  </div>
                  <Upload className="h-8 w-8 text-pink-600" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link href={`/${locale}/dashboard/withdrawal`} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Solicitar Retiro</h3>
                    <p className="text-sm text-gray-600">
                      Disponible: €{model.totalEarnings.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link href={`/${locale}/dashboard/upgrade`} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Mejorar Membresía</h3>
                    <p className="text-sm text-gray-600">Desbloquea más funciones</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Transacciones Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.user.email} • {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +€{transaction.netAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total: €{transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No hay transacciones recientes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
