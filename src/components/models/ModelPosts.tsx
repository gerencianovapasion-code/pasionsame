'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Lock, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: string;
  content: string;
  isPremium: boolean;
  price: number | null;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  model: {
    username: string;
    displayName: string;
    profileImage: string | null;
    membershipType: string;
    isVerified: boolean;
  };
  media: Array<{
    id: string;
    url: string;
    type: string;
    thumbnail: string | null;
  }>;
  _count: {
    likes: number;
    comments: number;
  };
}

interface ModelPostsProps {
  modelId: string;
  isSubscribed: boolean;
}

export function ModelPosts({ modelId, isSubscribed }: ModelPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [modelId, page]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?modelId=${modelId}&page=${page}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error al cargar posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      fetchPosts(); // Recargar posts
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-32 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg font-medium">
            Publicaciones
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            Fotos
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            Videos
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => {
        const canView = !post.isPremium || isSubscribed;

        return (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold">
                    {post.model.displayName[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{post.model.displayName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {post.isPremium && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Premium €{post.price?.toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="mb-4">
                {canView ? (
                  <>
                    <p className="whitespace-pre-wrap mb-4">{post.content}</p>
                    {/* Media */}
                    {post.media && post.media.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {post.media.map((media) => (
                          <div key={media.id} className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                            {media.type === 'IMAGE' && (
                              <Image
                                src={media.url}
                                alt="Media"
                                fill
                                className="object-cover"
                              />
                            )}
                            {media.type === 'VIDEO' && (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-12 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Contenido Premium</p>
                    <Button className="bg-gradient-to-r from-pink-600 to-rose-600">
                      Suscríbete para ver
                    </Button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>{post._count.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post._count.comments}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {posts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Este modelo aún no ha publicado contenido</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
