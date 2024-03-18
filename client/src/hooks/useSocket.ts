import { useContext } from "react";

// contexts
import { SocketContext } from "@/contexts/socket";

export const useSocket = () => {
  const { ...rest } = useContext(SocketContext);

  return {
    ...rest
  };
};
