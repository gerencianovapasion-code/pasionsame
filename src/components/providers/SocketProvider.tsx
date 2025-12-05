'use client';

import { useEffect } from 'react';
import { initSocket, disconnectSocket } from '@/lib/socket';

export function SocketProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  useEffect(() => {
    if (userId) {
      const socket = initSocket(userId);

      return () => {
        disconnectSocket();
      };
    }
  }, [userId]);

  return <>{children}</>;
}
