'use client';

import { ModelCard } from './ModelCard';

interface ModelGridProps {
  section: 'most-active' | 'online' | 'latest-posts' | 'top-rated' | 'new-members';
}

// Datos de ejemplo - en producción esto vendría de la base de datos
const sampleModels = [
  {
    id: '1',
    username: 'ana_bella',
    displayName: 'Ana Bella',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    gender: 'FEMALE' as const,
    city: 'Madrid',
    country: 'ES',
    province: 'Madrid',
    isOnline: true,
    isVerified: true,
    membershipType: 'GOLD' as const,
    subscriptionPrice: 15.99,
    totalSubscribers: 1234,
    averageRating: 4.8,
  },
  {
    id: '2',
    username: 'carlos_fit',
    displayName: 'Carlos Fitness',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    gender: 'MALE' as const,
    city: 'Barcelona',
    country: 'ES',
    province: 'Barcelona',
    isOnline: false,
    isVerified: true,
    membershipType: 'SILVER' as const,
    subscriptionPrice: 12.99,
    totalSubscribers: 856,
    averageRating: 4.6,
  },
  {
    id: '3',
    username: 'sofia_dreams',
    displayName: 'Sofia Dreams',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    gender: 'FEMALE' as const,
    city: 'Lisboa',
    country: 'PT',
    province: 'Lisboa',
    isOnline: true,
    isVerified: true,
    membershipType: 'GOLD' as const,
    subscriptionPrice: 18.99,
    totalSubscribers: 2103,
    averageRating: 4.9,
  },
  {
    id: '4',
    username: 'alex_style',
    displayName: 'Alex Style',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    gender: 'MALE' as const,
    city: 'Valencia',
    country: 'ES',
    province: 'Valencia',
    isOnline: false,
    isVerified: false,
    membershipType: 'BRONZE' as const,
    subscriptionPrice: 10.00,
    totalSubscribers: 342,
    averageRating: 4.3,
  },
  {
    id: '5',
    username: 'luna_star',
    displayName: 'Luna Star',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    gender: 'TRANS' as const,
    city: 'Paris',
    country: 'FR',
    province: 'Île-de-France',
    isOnline: true,
    isVerified: true,
    membershipType: 'GOLD' as const,
    subscriptionPrice: 16.99,
    totalSubscribers: 1567,
    averageRating: 4.7,
  },
  {
    id: '6',
    username: 'marco_passion',
    displayName: 'Marco Passion',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    gender: 'MALE' as const,
    city: 'Roma',
    country: 'IT',
    province: 'Lazio',
    isOnline: false,
    isVerified: true,
    membershipType: 'SILVER' as const,
    subscriptionPrice: 13.99,
    totalSubscribers: 923,
    averageRating: 4.5,
  },
];

export function ModelGrid({ section }: ModelGridProps) {
  // En producción, aquí haríamos fetch a la API según la sección
  const models = sampleModels;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
}
