// lib
import { Sidebar } from "@excalidraw/excalidraw";

// components
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";

// icons
import { FaVideo } from "react-icons/fa6";

// types
import { messageType } from "@/types/chat";

export type chatboxProps = {
  open: boolean;
  onDock: () => void;
  openConferenceModal: () => void;
  messages: messageType[];
  userId: string | undefined;
  title: string;
  handleSubmitMessage: (message: string) => void;
};

const Chatbox = (props: chatboxProps) => {
  const { open, onDock, title, openConferenceModal } =
    props;
  return (
    <Sidebar
      name="chat"
      docked={open}
      onDock={onDock}
    >
      <Sidebar.Header className="flex justify-center gap-2">
        <h3 className="text-lg font-bold flex-grow">
          {title}
        </h3>
        <button
          className="bg-accent text-contrast-dark p-2 rounded-full"
          onClick={openConferenceModal}
        >
          <FaVideo />
        </button>
      </Sidebar.Header>
      <ChatMessages {...props} />
      <ChatInput {...props} />
    </Sidebar>
  );
};

export default Chatbox;
