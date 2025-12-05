'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, MapPin, Star, Users, Video } from 'lucide-react';

interface ModelCardProps {
  model: {
    id: string;
    username: string;
    displayName: string;
    profileImage: string;
    gender: 'MALE' | 'FEMALE' | 'TRANS';
    city: string;
    country: string;
    province: string;
    isOnline: boolean;
    isVerified: boolean;
    membershipType: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD';
    subscriptionPrice: number;
    totalSubscribers: number;
    averageRating: number;
  };
}

const membershipColors = {
  FREE: 'bg-gray-100 text-gray-700',
  BRONZE: 'bg-orange-100 text-orange-700',
  SILVER: 'bg-gray-200 text-gray-800',
  GOLD: 'bg-yellow-100 text-yellow-700',
};

const membershipGradients = {
  FREE: 'from-gray-200 to-gray-300',
  BRONZE: 'from-orange-300 to-orange-400',
  SILVER: 'from-gray-300 to-gray-400',
  GOLD: 'from-yellow-300 to-yellow-400',
};

export function ModelCard({ model }: ModelCardProps) {
  const locale = useLocale();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Online Indicator */}
      {model.isOnline && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-green-500 text-white">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
            En línea
          </Badge>
        </div>
      )}

      {/* Membership Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className={membershipColors[model.membershipType]}>
          {model.membershipType}
        </Badge>
      </div>

      {/* Profile Image */}
      <Link href={`/${locale}/models/${model.username}`}>
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src={model.profileImage}
            alt={model.displayName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${membershipGradients[model.membershipType]} opacity-0 group-hover:opacity-20 transition-opacity`} />
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Name and Verification */}
        <div className="flex items-start justify-between mb-2">
          <Link href={`/${locale}/models/${model.username}`}>
            <h3 className="font-bold text-lg group-hover:text-pink-600 transition-colors flex items-center gap-1">
              {model.displayName}
              {model.isVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
              )}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">@{model.username}</p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {model.city}, {model.province}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{model.totalSubscribers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{model.averageRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-center mb-3">
          <span className="text-2xl font-bold text-pink-600">
            €{model.subscriptionPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-600">/mes</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
          asChild
        >
          <Link href={`/${locale}/models/${model.username}`}>
            Ver Perfil
          </Link>
        </Button>
        {model.isOnline && (
          <Button variant="outline" size="icon" asChild>
            <Link href={`/${locale}/models/${model.username}/stream`}>
              <Video className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
