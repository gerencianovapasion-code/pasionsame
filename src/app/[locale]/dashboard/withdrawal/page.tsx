import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { WithdrawalForm } from '@/components/dashboard/WithdrawalForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

export default async function WithdrawalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session || session.user.role !== 'MODEL') {
    redirect(`/${locale}/login`);
  }

  const model = await prisma.model.findUnique({
    where: { userId: session.user.id },
  });

  if (!model) {
    redirect(`/${locale}/register/model`);
  }

  const withdrawals = await prisma.withdrawal.findMany({
    where: { modelId: model.id },
    orderBy: { createdAt: 'desc' },
  });

  const minimumWithdrawal = Number(process.env.MINIMUM_WITHDRAWAL) || 50;

  const statusConfig = {
    PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
    APPROVED: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', label: 'Aprobado' },
    PAID: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Pagado' },
    REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rechazado' },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Solicitar Retiro</h1>
          <p className="text-gray-600 mt-2">
            Retira tus ganancias de forma segura
          </p>
        </div>

        {/* Balance Disponible */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Balance Disponible</p>
                <p className="text-4xl font-bold text-green-600">
                  €{model.totalEarnings.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Mínimo para retiro: €{minimumWithdrawal}
                </p>
              </div>
              <DollarSign className="h-16 w-16 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Formulario de Retiro */}
        {Number(model.totalEarnings) >= minimumWithdrawal ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nueva Solicitud de Retiro</CardTitle>
            </CardHeader>
            <CardContent>
              <WithdrawalForm
                modelId={model.id}
                maxAmount={Number(model.totalEarnings)}
                locale={locale}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">
                Necesitas al menos €{minimumWithdrawal} para solicitar un retiro.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Te faltan €{(minimumWithdrawal - Number(model.totalEarnings)).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Historial de Retiros */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Retiros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => {
                const status = statusConfig[withdrawal.status];
                const Icon = status.icon;

                return (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-semibold">€{withdrawal.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {withdrawal.method} • {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </p>
                        {withdrawal.notes && (
                          <p className="text-xs text-gray-500 mt-1">{withdrawal.notes}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                );
              })}
              {withdrawals.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No has realizado ninguna solicitud de retiro
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
