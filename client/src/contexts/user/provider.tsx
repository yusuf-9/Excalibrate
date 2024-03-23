import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

// context
import { UserContext } from "./context";

// Hooks
import { useSocket } from "@/hooks/useSocket";
import { useStore } from "@/hooks/useStore";

// Types
import { UserType } from "@/types/store";
import { messageType } from "@/types/chat";
import { UserProviderProps } from "./types";

// Create the provider component
const UserProvider = ({ children }: UserProviderProps) => {
  // router
  const navigate = useNavigate();

  // state
  const [roomId, setRoomId] = useState("");
  const { userAtom, collaboratersAtom } = useStore();
  const [user, setUser] = useRecoilState(userAtom);
  const [collaboraters, setCollaboraters] = useRecoilState(collaboratersAtom);

  // Socket
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("joined-room", ([users, newRoomId]: [UserType[], string]) => {
      users?.forEach(connectedUser => {
        if (connectedUser?.socketId === socket?.id) {
          if (!user) setUser(connectedUser);
        } else setCollaboraters(prev => [...prev, connectedUser]);
      });

      if (!roomId) {
        setRoomId(newRoomId);
        navigate(`/${newRoomId}`);
      }
    });

    socket?.on("chat-history", (data: messageType[]) => {
      console.log("recieved chat history", data);
      localStorage.setItem("chat-history", JSON.stringify(data));
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket?.off("joined-room");
      socket?.off("chat-history");
    };
  }, [navigate, roomId, setCollaboraters, setUser, socket, user]);

  const handleJoinRoom = useCallback(
    (data: { name: string; roomId?: string }) => {
      console.log("joining room");
      socket?.emit("join-room", data);
    },
    [socket]
  );

  return (
    <UserContext.Provider value={{ user, collaborators: collaboraters, handleJoinRoom }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
