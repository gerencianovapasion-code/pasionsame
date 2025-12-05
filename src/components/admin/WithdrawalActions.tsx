'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface WithdrawalActionsProps {
  withdrawalId: string;
  action: 'approve' | 'reject' | 'mark-paid';
}

export function WithdrawalActions({ withdrawalId, action }: WithdrawalActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!confirm(`¿Estás seguro de que quieres ${getActionLabel(action)}?`)) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al procesar acción');
        return;
      }

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar acción');
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'approve':
        return 'aprobar este retiro';
      case 'reject':
        return 'rechazar este retiro';
      case 'mark-paid':
        return 'marcar este retiro como pagado';
      default:
        return 'realizar esta acción';
    }
  };

  const getButtonConfig = () => {
    switch (action) {
      case 'approve':
        return { label: 'Aprobar', variant: 'default' as const };
      case 'reject':
        return { label: 'Rechazar', variant: 'destructive' as const };
      case 'mark-paid':
        return { label: 'Marcar Pagado', variant: 'default' as const };
    }
  };

  const config = getButtonConfig();

  return (
    <Button
      size="sm"
      variant={config.variant}
      onClick={handleAction}
      disabled={isLoading}
    >
      {isLoading ? 'Procesando...' : config.label}
    </Button>
  );
}
