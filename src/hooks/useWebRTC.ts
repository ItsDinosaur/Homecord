// src/hooks/useWebRTC.ts
import { useEffect, useRef, useState } from 'react';

type PeerConnectionMap = Record<string, RTCPeerConnection>;

export function useWebRTC(ws: WebSocket, currentUserId: string) {
  const peerConnections = useRef<PeerConnectionMap>({});
  const localStream = useRef<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  
  // Initialize peer connection for a user
  const createPeerConnection = (userId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add your TURN server if needed
      ]
    });
    
    pc.onicecandidate = (event) => {
      if (event.candidate && ws) {
        ws.send(JSON.stringify({
          type: 'IceCandidate',
          candidate: event.candidate.toJSON(),
          target_id: userId
        }));
      }
    };
    
    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [userId]: event.streams[0]
      }));
    };
    
    peerConnections.current[userId] = pc;
    return pc;
  };
  
  // Start voice in a channel
  const startVoice = async (channelId: string) => {
    if (!ws) return;
    
    try {
      // Get audio stream
      console.log('🎤 Requesting microphone permission...');
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Notify server we're joining
      ws.send(JSON.stringify({
        type: 'JoinVoice',
        channel_id: channelId
      }));
    } catch (err) {
      console.error('Error starting voice:', err);
    }
  };
  
  // Add video to existing connection
  const startVideo = async () => {
    if (!localStream.current) return;
    
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStream.getTracks().forEach(track => {
        Object.values(peerConnections.current).forEach(pc => {
          pc.addTrack(track, videoStream);
        });
      });
      
      // Add video tracks to local stream
      videoStream.getTracks().forEach(track => {
        localStream.current?.addTrack(track);
      });
    } catch (err) {
      console.error('Error starting video:', err);
    }
  };
  
  // Start screen share
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false // You can capture system audio if needed
      });
      
      screenStream.getTracks().forEach(track => {
        Object.values(peerConnections.current).forEach(pc => {
          pc.addTrack(track, screenStream);
        });
      });
      
      // Handle when user stops sharing
      screenStream.getTracks()[0].onended = () => {
        // You might want to notify other clients
      };
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };
  
  // Handle WebSocket messages
  useEffect(() => {
    if (!ws) return;
    
    const handleMessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'JoinVoice': {
          if (data.channel_id && data.user_id !== currentUserId) {
            const pc = createPeerConnection(data.user_id);
            
            // Add our local tracks if we have them
            if (localStream.current) {
              localStream.current.getTracks().forEach(track => {
                pc.addTrack(track, localStream.current!);
              });
            }
            
            // Create and send offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            ws.send(JSON.stringify({
              type: 'RtcOffer',
              sdp: offer.sdp,
              target_id: data.user_id
            }));
          }
          break;
        }
        
        case 'RtcOffer': {
          const pc = createPeerConnection(data.user_id);
          
          await pc.setRemoteDescription(new RTCSessionDescription({
            type: 'offer',
            sdp: data.sdp
          }));
          
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          ws.send(JSON.stringify({
            type: 'RtcAnswer',
            sdp: answer.sdp,
            target_id: data.user_id
          }));
          
          break;
        }
        
        case 'RtcAnswer': {
          const pc = peerConnections.current[data.user_id];
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription({
              type: 'answer',
              sdp: data.sdp
            }));
          }
          break;
        }
        
        case 'IceCandidate': {
          const pc = peerConnections.current[data.user_id];
          if (pc && data.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
          break;
        }
      }
    };
    
    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [ws, currentUserId]);
  
  return {
    startVoice,
    startVideo,
    startScreenShare,
    remoteStreams,
    localStream: localStream.current
  };
}