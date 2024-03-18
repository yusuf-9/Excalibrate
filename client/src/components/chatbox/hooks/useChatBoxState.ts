import { useMemo, useState } from "react";

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
export const useChatBoxState = () => {
  const {chatDrawerAtom, conferenceModalAtom} = useStore();
  const [isChatDrawerDocked, setIsChatDrawerDocked] = useRecoilState(chatDrawerAtom);
  const setModalState = useSetRecoilState(conferenceModalAtom);
  
  const {user} = useUser();
  const {socket} = useSocket();

  const localChatHistory = useMemo(() => getValueFromLocalStorage("chat-history"), []);
  const [messages, setMessages] = useState<messageType[]>(localChatHistory ? JSON.parse(localChatHistory) : []);

  return {
    isChatDrawerDocked,
    socket,
    user,
    messages,
    setIsChatDrawerDocked,
    setMessages,
    setModalState,
  }
};