import { format } from "date-fns";

// types
import { chatboxProps } from ".";

const ChatMessages = ({ messages, userId, collaborators }: chatboxProps) => (
  <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-5 border-b border-contrast-dark">
    {messages.map((message, index) => (
      <ChatMessage
        key={index}
        userId={userId}
        name={collaborators?.find(user => user?.socketId === message.socketId)?.name ?? ""}
        {...message}
      />
    ))}
  </div>
);

const ChatMessage = ({
  socketId,
  content,
  name,
  userId,
  timestamp
}: {
  name: string;
  content: string;
  userId: string | undefined;
  socketId: string;
  timestamp: number
}) => (
  <div className={`flex items-start ${socketId === userId ? "justify-end" : "justify-start"}`}>
    <div
      className={`border-2 border-contrast-dark text-primary-dark px-3 py-2 rounded-2xl text-sm ${
        socketId === userId
          ? "rounded-br-none translate-x-2 bg-primary-light text-contrast-dark"
          : "rounded-bl-none -translate-x-2 bg-accent-dark text-white"
      }`}
    >
      <p className={`mb-0 ${socketId === userId ? "text-contrast-dark" : "text-white"} font-medium`}>{content}</p>
      <div className="w-full flex justify-between items-center gap-5 mt-2">
        <p className={`${socketId === userId ? "text-right text-contrast-dark" : "text-right text-white"} text-xs`}>
          {format(new Date(timestamp), 'hh:mm a')}
        </p>
        <p className={`${socketId === userId ? "text-right text-contrast-dark" : "text-right text-white"} text-xs`}>
          {socketId === userId ? "You" : name}
        </p>
      </div>
    </div>
  </div>
);

export default ChatMessages;
