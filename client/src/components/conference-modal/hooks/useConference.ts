import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

// hooks
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { useStore } from "@/hooks/useStore";

// models
import PeerManager from "@/models/peerManager";

// utils
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
  const { conferenceModalAtom } = useStore()
  const setConferenceModal = useSetRecoilState(conferenceModalAtom)

  const { socket } = useSocket();
  const { user, collaborators } = useUser();
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const peerModel = useRef<any>();

  const streamingParticipants = useMemo(() => participants?.filter(participant => Boolean(participant.stream)), [participants]);

  const handleInitializePeer = useCallback(async () => {
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

  
  const handleEndCall = useCallback(() => {
    peerModel.current.endSession(socket);
    setParticipants([]);
    setConferenceModal({
      docked: false,
      open: false
    });
  }, [setConferenceModal, socket]);
  
  const handleAddNewPeer = useCallback((peers: { peerId: string; socketId: string }[]) => {
    const newPeers: Participant[] = getNewPeers(peers, participants, collaborators);
    setParticipants(prev => [...prev, ...newPeers]);
  }, [collaborators, participants]);

  const handleDisconnectPeer = useCallback((peerId: string) => {
    const newPeers = participants?.filter(participant => participant.peerId !== peerId);
    setParticipants(newPeers);
  }, [participants])

  useEffect(() => {
    socket?.on("new-peer-connected", handleAddNewPeer);
    socket?.on("peer-disconnected", handleDisconnectPeer);

    return () => {
      socket?.off("new-peer-connected");
      socket?.off("peer-disconnected");
    };
  }, [handleAddNewPeer, handleDisconnectPeer, socket]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleEndCall);

    return () => {
      window.removeEventListener("beforeunload", handleEndCall);
    };
  }, [handleEndCall]);



  return {
    participants: streamingParticipants,
    collaborators,
    socket,
    setParticipants,
    handleInitializePeer,
    handleEndCall
  };
};
