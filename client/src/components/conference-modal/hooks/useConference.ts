import { useCallback, useEffect, useRef, useState } from "react";

// hooks
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import PeerManager from "@/models/peerManager";
import { getNewPeers } from "../utils";

// types
export type Participant = {
  socketId: string;
  peerId: string;
  name: string;
  stream: MediaStream | null;
  streamType: "audio" | "video";
};

export type ServerPeerResponse = {
  peerId: string;
  socketId: string;
};

export const useConference = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { socket } = useSocket();
  const { user, collaborators } = useUser();
  const peerModel = useRef<any>();

  const handleConnectPeer = useCallback(async () => {
    try {
      const localStream = await navigator?.mediaDevices?.getUserMedia({
        audio: true,
      });
      const peerModelInstance = new PeerManager(localStream);
      peerModelInstance.initializeConnection(socket!, user, collaborators, setParticipants);
      peerModel.current = peerModelInstance;
    } catch (error) {
      console.error(error);
    }
  }, [collaborators, socket, user]);

  useEffect(() => {
    socket?.on("new-peer-connected", (peers: { peerId: string; socketId: string }[]) => {
      const newPeers: Participant[] = getNewPeers(peers, participants, collaborators);
      setParticipants(prev => [...prev, ...newPeers]);
    });

    return () => {
      socket?.off("new-peer-connected");
    };
  }, [collaborators, participants, socket]);

  const streamedParticipants = participants?.filter(participant => Boolean(participant.stream));

  console.log({participants})

  return {
    participants: streamedParticipants,
    collaborators,
    socket,
    setParticipants,
    handleConnectPeer,
  };
};
