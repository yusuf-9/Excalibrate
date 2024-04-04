import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

// hooks
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { useStore } from "@/hooks/useStore";

// models
import PeerManager from "@/models/peerManager";

// utils
import { getNewPeers, getParticipant } from "../utils";

// types
export type Participant = {
  socketId: string;
  peerId: string;
  name: string;
  stream: MediaStream | null;
  streamType: "audio" | "video";
  muted: boolean;
};

export type ServerPeerResponse = {
  peerId: string;
  socketId: string;
};

export const useConference = () => {
  const { conferenceModalAtom } = useStore();
  const setConferenceModal = useSetRecoilState(conferenceModalAtom);

  const { socket } = useSocket();
  const { user, collaborators } = useUser();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const peerModel = useRef<any>();

  const streamingParticipants = useMemo(
    () => participants?.filter(participant => Boolean(participant.stream)),
    [participants]
  );
  const isUserMuted = useMemo(() => getParticipant(participants, socket?.id)?.muted, [participants, socket?.id]);

  const handleMuteToggle = useCallback(() => {
    peerModel.current?.handleMuteStream(isUserMuted);
    setParticipants(participants =>
      participants?.map(participant => {
        if (participant.socketId === socket?.id) {
          return {
            ...participant,
            muted: !participant.muted,
          };
        }
        return participant;
      })
    );
    socket?.emit("peer-mute", { muted: !isUserMuted, peerId: getParticipant(participants, socket?.id)?.peerId });
  }, [isUserMuted, participants, socket]);

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
      open: false,
    });
  }, [setConferenceModal, socket]);

  const handleAddNewPeer = useCallback(
    (peers: { peerId: string; socketId: string }[]) => {
      const newPeers: Participant[] = getNewPeers(peers, participants, collaborators);
      setParticipants(prev => [...prev, ...newPeers]);
    },
    [collaborators, participants]
  );

  const handleDisconnectPeer = useCallback(
    (peerId: string) => {
      const newPeers = participants?.filter(participant => participant.peerId !== peerId);
      setParticipants(newPeers);
    },
    [participants]
  );

  const handleRemotePeerMute = useCallback(({ peerId, muted }: { peerId: string; muted: boolean }) => {
    console.log({peerId, muted})
    setParticipants(participants =>
      participants?.map(participant => {
        if (participant.peerId === peerId) {
          return {
            ...participant,
            muted: muted,
          };
        }
        return participant;
      })
    );
  }, []);

  useEffect(() => {
    socket?.on("new-peer-connected", handleAddNewPeer);
    socket?.on("peer-disconnected", handleDisconnectPeer);
    socket?.on("remote-peer-mute", handleRemotePeerMute);

    return () => {
      socket?.off("new-peer-connected");
      socket?.off("peer-disconnected");
      socket?.off("remote-peer-mute");
    };
  }, [handleAddNewPeer, handleDisconnectPeer, handleRemotePeerMute, socket]);

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
    muted: isUserMuted ? true : false,
    setParticipants,
    handleInitializePeer,
    handleEndCall,
    handleMuteToggle,
  };
};
