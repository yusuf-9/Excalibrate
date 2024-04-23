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

  // event handlers
  const handleDisconnectUser = useCallback(() => {
    socket.emit('user-disconnected')
  }, [socket]);

  const handleUserDisconnection = useCallback((socketId: string) => {
    setCollaboraters((prev) => {
      return prev.filter((user) => user.socketId!== socketId);
    })
  }, [setCollaboraters]);


  const handleUserJoinRoomEvent = useCallback(([users, newRoomId]: [UserType[], string]) => {
      users?.forEach(connectedUser => {
        if (connectedUser?.socketId === socket?.id) {
          if (!user) setUser(connectedUser);
        } else setCollaboraters(prev => [...prev, connectedUser]);
      });

      if (!roomId) {
        setRoomId(newRoomId);
        navigate(`/${newRoomId}`);
      }
    }, [navigate, roomId, setCollaboraters, setUser, socket?.id, user])

    const handleRecieveChatHistoryEvent = useCallback((data: messageType[]) => {
        localStorage.setItem("chat-history", JSON.stringify(data));
    }, [])

  const handleJoinRoom = useCallback(
    (data: { name: string; roomId?: string }) => {
      socket?.emit("join-room", data);
    },
    [socket]
  );

  // effect for listening to socket events
  useEffect(() => {
    socket?.on("joined-room", handleUserJoinRoomEvent);
    socket?.on("chat-history", handleRecieveChatHistoryEvent);
    socket?.on("user-disconnected", handleUserDisconnection);

    // Clean up the socket connection on component unmount
    return () => {
      socket?.off("joined-room", handleUserJoinRoomEvent);
      socket?.off("chat-history", handleRecieveChatHistoryEvent);
      socket?.off("user-disconnected", handleUserDisconnection);
    };
  }, [handleRecieveChatHistoryEvent, handleUserDisconnection, handleUserJoinRoomEvent, socket]);

  // effect for emitting user leave event
    useEffect(() => {
    window.addEventListener("beforeunload", handleDisconnectUser);

    return () => {
      window.removeEventListener("beforeunload", handleDisconnectUser);
    };
  }, [handleDisconnectUser]);

  return (
    <UserContext.Provider value={{ user, collaborators: collaboraters, handleJoinRoom }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
