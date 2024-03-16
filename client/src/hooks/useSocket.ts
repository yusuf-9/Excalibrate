import { useContext } from "react";

// providers
import { SocketContext } from "@/providers/socket";

export const useSocket = () => {
  const { socket } = useContext(SocketContext);

  return {
    socket,
  };
};
