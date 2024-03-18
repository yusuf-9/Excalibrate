// types
import { chatboxProps } from ".";

const ChatMessages = ({
  messages,
  userId,
}: chatboxProps) => (
  <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-5 border-b border-contrast-dark">
    {messages.map((message, index) => (
      <ChatMessage
        key={index}
        {...message}
        userId={userId}
      />
    ))}
  </div>
);

const ChatMessage = ({
  authorId,
  message,
  author,
  userId,
}: {
  author: string;
  message: string;
  userId: string | undefined;
  authorId: string;
}) => (
  <div
    className={`flex items-start ${authorId === userId ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`border-2 border-contrast-dark text-primary-dark px-3 py-2 rounded-2xl text-sm ${
        authorId === userId
          ? "rounded-br-none translate-x-2 bg-primary-light text-contrast-dark"
          : "rounded-bl-none -translate-x-2 bg-accent-dark text-white"
      }`}
    >
      <p
        className={`mb-0 ${authorId === userId ? "text-contrast-dark" : "text-white"} font-medium`}
      >
        {message}
      </p>
      <p
        className={`${authorId === userId ? "text-right text-contrast-dark" : "text-right text-white"} text-xs mt-2`}
      >
        {authorId === userId ? "You" : author}
      </p>
    </div>
  </div>
);

export default ChatMessages;