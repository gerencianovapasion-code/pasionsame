'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Image as ImageIcon, Smile } from 'lucide-react';
import { getSocket, sendMessage, markMessageAsRead, startTyping, stopTyping } from '@/lib/socket';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
  senderImage?: string;
}

interface Conversation {
  id: string;
  name: string;
  image?: string;
  lastMessage?: string;
  unreadCount: number;
  isOnline: boolean;
}

interface MessagingComponentProps {
  currentUserId: string;
  conversations: Conversation[];
  initialMessages?: Message[];
}

export function MessagingComponent({
  currentUserId,
  conversations,
  initialMessages = [],
}: MessagingComponentProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket = getSocket();

    // Escuchar nuevos mensajes
    socket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();

      // Marcar como leído si la conversación está abierta
      if (message.senderId === selectedConversation) {
        markMessageAsRead(message.id);
      }
    });

    // Escuchar indicador de escritura
    socket.on('user-typing', (userId: string) => {
      if (userId === selectedConversation) {
        setIsTyping(true);
      }
    });

    socket.on('user-stopped-typing', (userId: string) => {
      if (userId === selectedConversation) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('user-stopped-typing');
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    sendMessage(selectedConversation, messageInput);
    setMessageInput('');

    // Detener indicador de escritura
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTyping(selectedConversation);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (!selectedConversation) return;

    // Enviar indicador de escritura
    startTyping(selectedConversation);

    // Detener después de 3 segundos
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedConversation);
    }, 3000);
  };

  const selectedConvData = conversations.find((c) => c.id === selectedConversation);
  const conversationMessages = messages.filter(
    (m) =>
      (m.senderId === selectedConversation && m.receiverId === currentUserId) ||
      (m.senderId === currentUserId && m.receiverId === selectedConversation)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Lista de conversaciones */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Mensajes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-y-auto h-[500px]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-pink-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {conversation.image ? (
                      <img
                        src={conversation.image}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold">
                        {conversation.name[0]}
                      </div>
                    )}
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{conversation.name}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-pink-600">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="md:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                {selectedConvData?.image && (
                  <img
                    src={selectedConvData.image}
                    alt={selectedConvData.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">{selectedConvData?.name}</CardTitle>
                  {selectedConvData?.isOnline && (
                    <p className="text-sm text-green-600">En línea</p>
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Mensajes */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => {
                const isOwn = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwn
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {message.mediaUrl && (
                        <img
                          src={message.mediaUrl}
                          alt="Media"
                          className="rounded mb-2 max-w-full"
                        />
                      )}
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-white/80' : 'text-gray-600'}`}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={handleTyping}
                  placeholder="Escribe un mensaje..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Selecciona una conversación para empezar
          </div>
        )}
      </Card>
    </div>
  );
}
