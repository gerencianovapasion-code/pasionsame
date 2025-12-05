'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface SubscribeButtonProps {
  modelId: string;
  price: number;
}

export function SubscribeButton({ modelId, price }: SubscribeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Error al crear suscripción');
        return;
      }

      const { clientSecret } = await response.json();

      // Redirigir a Stripe Checkout o usar Elements
      if (clientSecret) {
        // Aquí integrarías Stripe Elements para el pago
        // Por ahora, simulamos éxito
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
    >
      <Heart className="h-4 w-4 mr-2" />
      {isLoading ? 'Procesando...' : `Suscribirse por €${price.toFixed(2)}/mes`}
    </Button>
  );
}
