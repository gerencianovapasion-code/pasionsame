'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Users, Send, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import { getSocket, joinStream, leaveStream, sendStreamMessage } from '@/lib/socket';

interface StreamPlayerProps {
  streamId: string;
  streamUrl: string;
  modelName: string;
  modelImage?: string;
  isSubscribed: boolean;
}

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: Date;
}

export function StreamPlayer({
  streamId,
  streamUrl,
  modelName,
  modelImage,
  isSubscribed,
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewersCount, setViewersCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    // Unirse al stream
    joinStream(streamId);

    // Escuchar eventos
    socket.on('viewers-count', (count: number) => {
      setViewersCount(count);
    });

    socket.on('stream-message', (data: ChatMessage) => {
      setChatMessages((prev) => [...prev, data]);
    });

    socket.on('stream-ended', () => {
      alert('El streaming ha finalizado');
      window.location.href = '/';
    });

    // Configurar video player
    if (videoRef.current && streamUrl) {
      // Aquí usarías HLS.js o similar para reproducir el stream
      // Por ahora simulamos con un video normal
      videoRef.current.src = streamUrl;
    }

    return () => {
      leaveStream(streamId);
      socket.off('viewers-count');
      socket.off('stream-message');
      socket.off('stream-ended');
    };
  }, [streamId, streamUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      sendStreamMessage(streamId, messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Video Player */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative bg-black aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full"
                onClick={togglePlay}
                autoPlay
                playsInline
              />

              {/* Badge EN VIVO */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-600 text-white px-3 py-1">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  EN VIVO
                </Badge>
              </div>

              {/* Viewers count */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-60 rounded-full px-3 py-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">{viewersCount}</span>
              </div>

              {/* Controles */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {modelImage && (
                      <img
                        src={modelImage}
                        alt={modelName}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    )}
                    <span className="text-white font-semibold">{modelName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="mt-4 flex gap-2">
          <Button className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600">
            <Heart className="h-4 w-4 mr-2" />
            Dar Propina
          </Button>
          <Button variant="outline" onClick={() => setShowChat(!showChat)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Chat */}
      {showChat && (
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Chat en Vivo</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(false)}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-semibold text-pink-600">{msg.userId}: </span>
                    <span>{msg.message}</span>
                  </div>
                ))}
              </div>

              {/* Input de mensaje */}
              {isSubscribed ? (
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Suscríbete para participar en el chat
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
