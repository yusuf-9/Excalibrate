import { useCallback, useEffect } from "react";
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

  // Store
  const { userAtom, collaboratersAtom } = useStore();
  const [user, setUser] = useRecoilState(userAtom);
  const [collaboraters, setCollaboraters] = useRecoilState(collaboratersAtom);

  // Socket
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("new-user-joined-room", (data: UserType) => {
      setCollaboraters(prev => [...prev, data]);
    });

    socket?.on("user-joined-room", (data: UserType) => {
      setUser(data);
    });

    socket?.on("chat-history", (data: messageType[]) => {
      console.log("recieved chat history", data);
      localStorage.setItem("chat-history", JSON.stringify(data));
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket?.off("new-user-joined-room");
      socket?.off("user-joined-room");
      socket?.off("chat-history");
    };
  }, [setCollaboraters, setUser, socket]);

  useEffect(() => {
    if (!user) return;
    navigate(`/${user?.roomId}`);
  }, [user, navigate]);

  const handleJoinRoom = useCallback(
    (data: { name: string; roomId?: string }) => {
      console.log("joining room");
      socket?.emit("join-room", data);
    },
    [socket]
  );

  return (
    <UserContext.Provider
      value={{ user, collaborators: collaboraters, handleJoinRoom }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
