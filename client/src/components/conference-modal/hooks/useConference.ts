import { useCallback, useEffect, useState } from "react";
import Peer from "peerjs";

// hooks
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";

// utils
import { getLocalStream } from "../utils";

// types
export type Participant = {
    socketId: string;
    peerId: string;
    name: string;
    stream: MediaStream | null;
    streamType: "audio" | "video"
}

export type ServerPeerResponse = {
  peerId: string;
  socketId: string;
}

export const useConference = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { socket } = useSocket();
  const { user, collaborators } = useUser();
  const [peerInstance, setPeerInstance] = useState<Peer>()

  const handleCallPeer = useCallback((remotePeers: ServerPeerResponse[], localStream: MediaStream, localPeerInstance: Peer, peers: Participant[]) => {

    remotePeers.forEach(({peerId}: {peerId: string}) => {
      const call = localPeerInstance?.call(peerId, localStream);
      // Receive the remote stream
      call?.on('stream', (remoteStream) => {
        console.log('Remote stream received:', remoteStream);
        const peer = peers?.find((participant) => participant?.peerId === peerId);
        if(peer){
          setParticipants((prev) => [
            ...prev,
            {
              ...peer,
              stream: remoteStream
            }
          ]);
        }
      });
    });
  }, []);

  const handleConnectPeer = useCallback(async () => {
    try {
      const localStream = await navigator?.mediaDevices?.getUserMedia({
        audio: true,
      });
      const localPeerInstance = new Peer();
      setPeerInstance(localPeerInstance);
  
      localPeerInstance.on('open', async (id: string) => {
        console.log('Connected with ID:', id);
        const remotePeers: ServerPeerResponse[] = await socket?.emitWithAck('peer-connected', id);
        const remotePeersData: Participant[] = remotePeers?.map((peer) => ({
          socketId: peer.socketId,
          peerId: peer.peerId,
          name: collaborators?.find((collaborator) => collaborator?.socketId === peer.socketId)?.name || '',
          stream: null,
          streamType: "audio",
        }));
        const localUser: Participant = {
        socketId: user!.socketId,
        peerId: id,
        name: user!.name,
        stream: localStream,
        streamType: "audio",
      }
      const peers = [
        localUser, 
        ...remotePeersData
      ];
        setParticipants([
          localUser,
        ]);

        handleCallPeer(remotePeers, localStream, localPeerInstance, peers)
  
        // Listen for incoming calls
        localPeerInstance.on('call', (incomingCall) => {
          console.log('Incoming call:', incomingCall);
          // Answer the call and send local stream
          incomingCall.answer(localStream);
          // Handle the remote stream when it arrives
          incomingCall.on('stream', (remoteStream) => {
            console.log('Remote stream received:', remoteStream);
            // Update the participants with the remote stream
            setParticipants((prevParticipants) => {
              return prevParticipants.map((participant) => {
                if (participant.peerId === incomingCall.peer) {
                  return {
                    ...participant,
                    stream: remoteStream,
                  };
                }
                return participant;
              });
            });
          });
        });
      });
  
      localPeerInstance.on('error', (err) => {
        console.error('PeerJS error:', err);
      });
    } catch (error) {
      console.error(error);
    }
  }, [collaborators, handleCallPeer, socket, user]);

  
  useEffect(() => {
    socket?.on('new-peer-connected', (peers: {peerId: string; socketId: string}[]) => {
      const newPeers = peers?.reduce((acc: any[], peer) => {
        if(peer.socketId === socket?.id || participants?.some((member) => member.socketId === peer.socketId)) return acc;
        console.log("new peer-connected", {participants, peer})

          acc.push({
            socketId: peer.socketId,
            peerId: peer.peerId,
            name: collaborators?.find((collaborator) => collaborator?.socketId === peer.socketId)?.name,
            stream: null,
            streamType: "audio",
          })

          return acc;
      }, [])

      setParticipants((prev => [...prev, ...newPeers]))
    })

    return () => {
      socket?.off('new-peer-connected')
    }
  }, [collaborators, participants, socket]);

  const streamedParticipants = participants?.filter((participant) => Boolean(participant.stream))


  return {
    participants: streamedParticipants,
    collaborators,
    socket,
    setParticipants,
    handleConnectPeer,
    handleCallPeer
  }
};
