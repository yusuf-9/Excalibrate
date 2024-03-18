import React from "react";

// icons
import { FaPaperPlane } from "react-icons/fa";

// types
import { chatboxProps } from ".";


const ChatInput = (props: chatboxProps) => {
  const { handleSubmitMessage } = props;
  const [message, setMessage] = React.useState("");

  const handleFormSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    handleSubmitMessage(message);
    setMessage("");
  };

  return (
    <form
      className="p-3 pt-5 m-2 rounded-2xl flex gap-2"
      onSubmit={handleFormSubmit}
    >
      <input
        className="flex-grow p-2 px-4 rounded-3xl text-black bg-white"
        placeholder="Say Hi..."
        value={message}
        onChange={e => setMessage(e?.target?.value)}
      />
      <button
        type="submit"
        className="text-contrast bg-accent hover:text-contrast-light transition duration-300 active:outline active:outline-primary rounded-full p-2 px-3"
      >
        <FaPaperPlane className="h-4 w-4" />
      </button>
    </form>
  );
};

export default ChatInput;
