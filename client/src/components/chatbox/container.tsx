import { useCallback, useEffect, useMemo, useState } from "react";

// components
import Chatbox from "./chatbox";

// store
import { useRecoilState, useSetRecoilState } from "recoil";

// hooks
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { useStore} from "@/hooks/useStore";

// types
import { messageType } from "@/types/chat";
import { getValueFromLocalStorage } from "@/utils";

// utils
const ChatboxContainer = () => {
  const {chatDrawerAtom, conferenceModalAtom} = useStore();
  const [isChatDrawerDocked, setIsChatDrawerDocked] = useRecoilState(chatDrawerAtom);
  const setModalState = useSetRecoilState(conferenceModalAtom);
  
  const {user} = useUser();
  const {socket} = useSocket();

  const localChatHistory = useMemo(() => getValueFromLocalStorage("chat-history"), []);
  const [messages, setMessages] = useState<messageType[]>(localChatHistory ? JSON.parse(localChatHistory) : []);

  useEffect(() => {
      socket?.on("message-recieved", (message: messageType) => {
        setMessages(prev => [...prev, message]);
      });
  
    return () => {
      socket?.off("message-recieved");
    };
  }, [socket]);

  const handleSubmitMessage = useCallback((message: string) => {
      const messagePayload = { message };
      socket?.emit("message", messagePayload);
    }, [socket]);

  const dockSidebar = () => {
    setIsChatDrawerDocked(prev => !prev);
  };

  return (
    <Chatbox
      open={isChatDrawerDocked}
      onDock={dockSidebar}
      messages={messages}
      userId={user?.socketId}
      title="Chats"
      openConferenceModal={() => setModalState(prev => ({ ...prev, open: true }))}
      handleSubmitMessage={handleSubmitMessage}
    />
  );
};

export default ChatboxContainer;
