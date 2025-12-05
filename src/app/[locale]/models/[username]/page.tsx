import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Share2,
  MessageCircle,
  Video,
  CheckCircle2,
  Phone,
  Globe,
} from 'lucide-react';
import { SubscribeButton } from '@/components/models/SubscribeButton';
import { ModelPosts } from '@/components/models/ModelPosts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}) {
  const { username } = await params;
  const model = await prisma.model.findUnique({
    where: { username },
    select: { displayName: true, bio: true, profileImage: true },
  });

  if (!model) return { title: 'Modelo no encontrado' };

  return {
    title: `${model.displayName} - Perfil de Creador`,
    description: model.bio || `Perfil de ${model.displayName}`,
    openGraph: {
      title: model.displayName,
      description: model.bio || '',
      images: model.profileImage ? [model.profileImage] : [],
    },
  };
}

export default async function ModelProfilePage({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}) {
  const { username, locale } = await params;
  const session = await auth();

  const model = await prisma.model.findUnique({
    where: { username },
    include: {
      country: true,
      province: true,
      user: { select: { email: true } },
      _count: {
        select: {
          posts: true,
          media: true,
          subscriptions: { where: { isActive: true } },
          reviews: true,
        },
      },
    },
  });

  if (!model) {
    notFound();
  }

  // Verificar si el usuario actual está suscrito
  let isSubscribed = false;
  if (session) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_modelId: {
          userId: session.user.id,
          modelId: model.id,
        },
      },
    });
    isSubscribed = subscription?.isActive || false;
  }

  const membershipBadges = {
    FREE: 'bg-gray-100 text-gray-800',
    BRONZE: 'bg-orange-100 text-orange-800',
    SILVER: 'bg-gray-200 text-gray-800',
    GOLD: 'bg-yellow-100 text-yellow-800',
  };

  const languages = JSON.parse(model.languages || '["es"]') as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-pink-400 to-rose-500">
        {model.coverImage && (
          <Image
            src={model.coverImage}
            alt={`Portada de ${model.displayName}`}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Info del Modelo */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Profile Image */}
                <div className="relative">
                  <div className="relative w-full h-64 bg-gray-200">
                    {model.profileImage ? (
                      <Image
                        src={model.profileImage}
                        alt={model.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-300 to-rose-400">
                        <span className="text-6xl text-white font-bold">
                          {model.displayName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  {model.isOnline && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-medium">En línea</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Name and Badges */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{model.displayName}</h1>
                      {model.isVerified && (
                        <CheckCircle2 className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <p className="text-gray-600">@{model.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={membershipBadges[model.membershipType]}>
                        {model.membershipType}
                      </Badge>
                      <Badge variant="outline">{model.gender}</Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="font-bold text-lg">{model._count.posts}</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{model._count.subscriptions}</div>
                      <div className="text-xs text-gray-600">Suscriptores</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <div className="font-bold text-lg">{model.averageRating.toFixed(1)}</div>
                    </div>
                  </div>

                  {/* Location and Details */}
                  <div className="space-y-3 mb-6 text-sm">
                    {model.city && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {model.city}, {model.province?.name}, {model.country.name}
                        </span>
                      </div>
                    )}
                    {model.age && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4" />
                        <span>{model.age} años</span>
                      </div>
                    )}
                    {languages.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Globe className="h-4 w-4" />
                        <span>{languages.join(', ')}</span>
                      </div>
                    )}
                    {model.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-4 w-4" />
                        <span className="font-semibold">{model.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {model.bio && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Sobre mí</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{model.bio}</p>
                    </div>
                  )}

                  {/* Subscription Price */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">
                        €{model.subscriptionPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">por mes</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {!isSubscribed ? (
                      <SubscribeButton modelId={model.id} price={Number(model.subscriptionPrice)} />
                    ) : (
                      <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Suscrito
                      </Button>
                    )}

                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </Button>

                    {model.isOnline && (
                      <Button variant="outline" className="w-full">
                        <Video className="h-4 w-4 mr-2" />
                        Videochat
                      </Button>
                    )}

                    <Button variant="ghost" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir Perfil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha - Posts y Contenido */}
          <div className="lg:col-span-2">
            <ModelPosts modelId={model.id} isSubscribed={isSubscribed} />
          </div>
        </div>
      </div>
    </div>
  );
}
