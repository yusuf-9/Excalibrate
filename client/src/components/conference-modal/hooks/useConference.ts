import { useCallback, useState } from "react";

// hooks
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";

// types
export type Participant = {
    socketId: string;
    name: string;
    stream: MediaStream;
    streamType: "audio" | "video"
}

export const useConference = () => {
  // local state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { socket } = useSocket();
  const { user, collaborators } = useUser();


  const handleCall = useCallback(async () => {
    try {
      const localStream = await navigator?.mediaDevices?.getUserMedia({
        audio: true,
      });
      setParticipants((prev: any) => [
        ...prev,
        {
          socketId: user?.socketId,
          name: user?.name,
          stream: localStream,
          streamType: "audio",
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  }, [user?.name, user?.socketId]);



  return {
    participants,
    collaborators,
    socket,
    setParticipants,
    handleCall,
  }
};
