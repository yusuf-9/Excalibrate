import { useCallback, useEffect } from "react";

// types
import { messageType } from "@/types/chat";

export const useChatBoxUpdates = ({
  socket,
  setMessages,
  setIsChatDrawerDocked,
}: any) => {
  const handleSubmitMessage = useCallback((message: string) => {
      const messagePayload = {
        message,
      };
      socket?.emit("message", messagePayload);
    }, [socket]);

  const dockSidebar = useCallback(() => {
    setIsChatDrawerDocked((prev: any) => !prev);
  }, [setIsChatDrawerDocked]);

  useEffect(() => {
    socket?.on("message-recieved", (message: messageType) => {
        setMessages((prev: any) => [...prev, message]);
    });

    return () => {
      socket?.off("message-recieved");
    };
  }, [socket, setMessages]);

  return {
    handleSubmitMessage,
    dockSidebar,
  };
};
