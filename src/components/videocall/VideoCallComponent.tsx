'use client';

import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  getSocket,
  initiateVideoCall,
  acceptVideoCall,
  rejectVideoCall,
  endVideoCall,
  sendSignal,
} from '@/lib/socket';

interface VideoCallComponentProps {
  callId: string;
  targetUserId: string;
  isCaller: boolean;
  modelName?: string;
  onCallEnd?: () => void;
}

export function VideoCallComponent({
  callId,
  targetUserId,
  isCaller,
  modelName,
  onCallEnd,
}: VideoCallComponentProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<SimplePeer.Instance | null>(null);

  useEffect(() => {
    // Obtener stream de medios
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.error('Error al acceder a cámara/micrófono:', error);
        alert('No se pudo acceder a la cámara o micrófono');
      });

    const socket = getSocket();

    // Si es el que llama, iniciar la llamada
    if (isCaller) {
      initiateVideoCall(callId, targetUserId);
    }

    // Escuchar eventos
    socket.on('call-accepted', ({ callId: acceptedCallId }) => {
      if (acceptedCallId === callId) {
        setCallAccepted(true);
        startCall(true);
      }
    });

    socket.on('call-rejected', () => {
      alert('Llamada rechazada');
      cleanup();
    });

    socket.on('call-ended', () => {
      cleanup();
    });

    socket.on('signal', ({ signal }) => {
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });

    // Si no es el que llama, esperar señal
    if (!isCaller) {
      setReceivingCall(true);
    }

    return () => {
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
      socket.off('signal');
      cleanup();
    };
  }, [callId, isCaller, targetUserId]);

  // Contador de duración
  useEffect(() => {
    if (callAccepted && !callEnded) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callAccepted, callEnded]);

  const startCall = (isInitiator: boolean) => {
    if (!stream) return;

    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      sendSignal(callId, data);
    });

    peer.on('stream', (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.on('error', (error) => {
      console.error('Error en peer:', error);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    acceptVideoCall(callId);
    startCall(false);
  };

  const rejectCall = () => {
    rejectVideoCall(callId);
    cleanup();
  };

  const leaveCall = () => {
    endVideoCall(callId);
    cleanup();
  };

  const cleanup = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (onCallEnd) {
      onCallEnd();
    }
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleSpeaker = () => {
    if (userVideo.current) {
      userVideo.current.muted = !isSpeakerOff;
      setIsSpeakerOff(!isSpeakerOff);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (callEnded) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Llamada Finalizada</h3>
        <p className="text-gray-600 mb-4">Duración: {formatDuration(callDuration)}</p>
        <Button onClick={() => window.location.reload()}>Cerrar</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video del usuario remoto */}
        <Card className="overflow-hidden bg-black aspect-video relative">
          {callAccepted && !callEnded ? (
            <video
              ref={userVideo}
              playsInline
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {modelName ? modelName[0] : '?'}
                  </span>
                </div>
                <p className="text-lg">{modelName || 'Esperando...'}</p>
              </div>
            </div>
          )}

          {callAccepted && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 rounded px-3 py-1 text-white">
              {formatDuration(callDuration)}
            </div>
          )}
        </Card>

        {/* Video propio */}
        <Card className="overflow-hidden bg-black aspect-video relative">
          <video
            ref={myVideo}
            muted
            playsInline
            autoPlay
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 rounded px-2 py-1 text-white text-sm">
            Tú
          </div>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex justify-center gap-4">
        <Button
          variant={isMuted ? 'destructive' : 'default'}
          size="icon"
          onClick={toggleMute}
          className="rounded-full h-14 w-14"
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          variant={isVideoOff ? 'destructive' : 'default'}
          size="icon"
          onClick={toggleVideo}
          className="rounded-full h-14 w-14"
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>

        <Button
          variant={isSpeakerOff ? 'outline' : 'default'}
          size="icon"
          onClick={toggleSpeaker}
          className="rounded-full h-14 w-14"
        >
          {isSpeakerOff ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>

        {receivingCall && !callAccepted ? (
          <>
            <Button
              onClick={answerCall}
              size="icon"
              className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700"
            >
              <Phone className="h-6 w-6" />
            </Button>
            <Button
              onClick={rejectCall}
              size="icon"
              className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </>
        ) : (
          <Button
            onClick={leaveCall}
            size="icon"
            className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        )}
      </div>

      {!callAccepted && isCaller && (
        <div className="text-center text-gray-600">
          <p>Llamando a {modelName}...</p>
        </div>
      )}

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
