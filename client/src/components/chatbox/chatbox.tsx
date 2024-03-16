import React from "react";

// components
import { FaPaperPlane } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { Sidebar } from "@excalidraw/excalidraw";

// types
import { messageType } from "@/types/chat";

type chatboxProps = {
  open: boolean;
  onDock: () => void;
  openConferenceModal: () => void;
  messages: messageType[];
  userId: string | undefined;
  title: string;
  handleSubmitMessage: (message: string) => void;
};

const Chatbox = (props: chatboxProps) => {
  const { open, onDock, title, openConferenceModal } = props;
  return (
    <Sidebar name="chat" docked={open} onDock={onDock}>
      <Sidebar.Header className="flex justify-center gap-2">
        <h3 className="text-lg font-bold flex-grow">{title}</h3>
        <button className="bg-accent text-contrast-dark p-2 rounded-full" onClick={openConferenceModal}>
          <FaVideo />
        </button>
      </Sidebar.Header>
      <ChatMessages {...props} />
      <ChatInput {...props} />
    </Sidebar>
  );
};

const ChatMessages = ({ messages, userId }: chatboxProps) => (
  <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-5 border-b border-contrast-dark">
    {messages.map((message, index) => (
      <ChatMessage key={index} {...message} userId={userId}/>
    ))}
  </div>
);

const ChatMessage = ({ authorId, message, author, userId }: { author: string; message: string; userId: string | undefined, authorId: string }) => (
  <div className={`flex items-start ${authorId === userId ? "justify-end" : "justify-start"}`}>
    <div
      className={`border-2 border-contrast-dark text-primary-dark px-3 py-2 rounded-2xl text-sm ${
        authorId === userId ? "rounded-br-none translate-x-2 bg-primary-light text-contrast-dark" : "rounded-bl-none -translate-x-2 bg-accent-dark text-white" 
      }`}>
      <p className={`mb-0 ${authorId === userId ? 'text-contrast-dark' : 'text-white'} font-medium`}>{message}</p>
      <p className={`${authorId === userId ? "text-right text-contrast-dark" : "text-right text-white"} text-xs mt-2`}>{authorId === userId ? "You" : author}</p>
    </div>
  </div>
);

const ChatInput = (props: chatboxProps) => {
  const { handleSubmitMessage } = props;
  const [message, setMessage] = React.useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitMessage(message);
    setMessage("");
  };

  return (
    <form className="p-3 pt-5 m-2 rounded-2xl flex gap-2" onSubmit={handleFormSubmit}>
      <input
        className="flex-grow p-2 px-4 rounded-3xl text-black bg-white"
        placeholder="Say Hi..."
        value={message}
        onChange={e => setMessage(e?.target?.value)}
      />
      <button type="submit" className="text-contrast bg-accent hover:text-contrast-light transition duration-300 active:outline active:outline-primary rounded-full p-2 px-3">
        <FaPaperPlane className="h-4 w-4" />
      </button>
    </form>
  );
};

export default Chatbox;
