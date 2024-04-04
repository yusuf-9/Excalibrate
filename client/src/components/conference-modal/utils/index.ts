import { Participant } from "../hooks/useConference";

export function getLocalStream(participants: Participant[], socketId: string | undefined) {
  return participants.find(participant => participant.socketId === socketId)?.stream;
}

export const getNewPeers = (peers: any, participants: any, collaborators: any) => {
  return peers?.reduce((acc: any[], peer: any) => {
    if (participants?.some((member: any) => member.socketId === peer.socketId)) return acc;

    acc.push({
      socketId: peer.socketId,
      peerId: peer.peerId,
      name: collaborators?.find((collaborator: any) => collaborator?.socketId === peer.socketId)?.name,
      stream: null,
      streamType: "audio",
      muted: false
    });

    return acc;
  }, []);
};

export const getParticipant = (participants: Participant[], socketId: string | undefined) => {
  return participants.find(participant => participant.socketId === socketId);
}
