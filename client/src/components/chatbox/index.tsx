// components
import Chatbox from "./components/chatbox";

// hooks
import { useChatBoxState } from "./hooks/useChatBoxState";
import { useChatBoxUpdates } from "./hooks/useChatBoxUpdates";

// utils
const ChatboxContainer = () => {
  const {
    isChatDrawerDocked,
    socket,
    user,
    messages,
    collaborators,
    setIsChatDrawerDocked,
    setMessages,
    setModalState,
  } = useChatBoxState();

  const { 
    handleSubmitMessage, 
    dockSidebar 
  } = useChatBoxUpdates({
      socket,
      setIsChatDrawerDocked,
      setMessages,
  });

  return (
    <Chatbox
      open={isChatDrawerDocked}
      onDock={dockSidebar}
      messages={messages}
      userId={user?.socketId}
      collaborators={collaborators}
      title="Chats"
      openConferenceModal={() =>
        setModalState(prev => ({
          ...prev,
          open: true,
        }))
      }
      handleSubmitMessage={handleSubmitMessage}
    />
  );
};

export default ChatboxContainer;
export * from "./components"
