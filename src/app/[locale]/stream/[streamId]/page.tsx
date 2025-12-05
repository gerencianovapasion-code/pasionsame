import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { notFound, redirect } from 'next/navigation';
import { StreamPlayer } from '@/components/streaming/StreamPlayer';
import { SocketProvider } from '@/components/providers/SocketProvider';

export default async function StreamPage({
  params,
}: {
  params: Promise<{ streamId: string; locale: string }>;
}) {
  const { streamId, locale } = await params;
  const session = await auth();

  const stream = await prisma.stream.findUnique({
    where: { id: streamId },
    include: {
      model: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!stream) {
    notFound();
  }

  if (!stream.isLive) {
    redirect(`/${locale}/models/${stream.model.username}`);
  }

  // Verificar acceso
  let isSubscribed = false;
  if (session) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_modelId: {
          userId: session.user.id,
          modelId: stream.modelId,
        },
      },
    });
    isSubscribed = subscription?.isActive || false;
  }

  // Si no está suscrito y el stream es de pago, verificar si compró acceso
  if (!isSubscribed && Number(stream.pricePerView) > 0) {
    if (!session) {
      redirect(`/${locale}/login?redirect=/stream/${streamId}`);
    }

    // Verificar si compró acceso
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: session.user.id,
        // Aquí verificarías compra específica del stream
      },
    });

    if (!purchase) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Stream Premium</h1>
            <p className="text-gray-600 mb-6">
              Este streaming requiere pago para acceder
            </p>
            <p className="text-3xl font-bold text-pink-600 mb-6">
              €{stream.pricePerView.toFixed(2)}
            </p>
            <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-lg font-semibold">
              Comprar Acceso
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <SocketProvider userId={session?.user.id}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <StreamPlayer
            streamId={stream.id}
            streamUrl={stream.streamUrl || ''}
            modelName={stream.model.displayName}
            modelImage={stream.model.profileImage || undefined}
            isSubscribed={isSubscribed}
          />
        </div>
      </div>
    </SocketProvider>
  );
}
