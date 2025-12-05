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
import { AlertCircle } from 'lucide-react';

const withdrawalSchema = z.object({
  amount: z.number().min(50, 'El mínimo es €50'),
  method: z.enum(['paypal', 'bank_transfer']),
  paypalEmail: z.string().email().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  accountHolder: z.string().optional(),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalFormProps {
  modelId: string;
  maxAmount: number;
  locale: string;
}

export function WithdrawalForm({ modelId, maxAmount, locale }: WithdrawalFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'paypal' | 'bank_transfer'>('paypal');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
  });

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const details: Record<string, string> = {};
      if (data.method === 'paypal') {
        details.email = data.paypalEmail || '';
      } else {
        details.account = data.bankAccount || '';
        details.bankName = data.bankName || '';
        details.accountHolder = data.accountHolder || '';
      }

      const response = await fetch('/api/withdrawals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId,
          amount: data.amount,
          method: data.method,
          details: JSON.stringify(details),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Error al crear solicitud');
        return;
      }

      router.refresh();
      alert('Solicitud de retiro creada exitosamente');
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Monto */}
      <div>
        <Label htmlFor="amount">Monto a Retirar *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="50"
          max={maxAmount}
          {...register('amount', { valueAsNumber: true })}
          className="mt-1"
          placeholder="50.00"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Máximo disponible: €{maxAmount.toFixed(2)}
        </p>
      </div>

      {/* Método */}
      <div>
        <Label>Método de Pago *</Label>
        <Select
          value={method}
          onValueChange={(value: 'paypal' | 'bank_transfer') => {
            setMethod(value);
            setValue('method', value);
          }}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Detalles según método */}
      {method === 'paypal' ? (
        <div>
          <Label htmlFor="paypalEmail">Email de PayPal *</Label>
          <Input
            id="paypalEmail"
            type="email"
            {...register('paypalEmail')}
            className="mt-1"
            placeholder="tu@email.com"
          />
          {errors.paypalEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.paypalEmail.message}</p>
          )}
        </div>
      ) : (
        <>
          <div>
            <Label htmlFor="accountHolder">Titular de la Cuenta *</Label>
            <Input
              id="accountHolder"
              {...register('accountHolder')}
              className="mt-1"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <Label htmlFor="bankName">Nombre del Banco *</Label>
            <Input
              id="bankName"
              {...register('bankName')}
              className="mt-1"
              placeholder="Banco XYZ"
            />
          </div>

          <div>
            <Label htmlFor="bankAccount">Número de Cuenta / IBAN *</Label>
            <Input
              id="bankAccount"
              {...register('bankAccount')}
              className="mt-1"
              placeholder="ES00 0000 0000 0000 0000"
            />
          </div>
        </>
      )}

      {/* Información */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Las solicitudes de retiro son procesadas en 3-5 días hábiles.
          Recibirás una notificación cuando tu retiro sea aprobado y procesado.
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      >
        {isLoading ? 'Procesando...' : 'Solicitar Retiro'}
      </Button>
    </form>
  );
}
