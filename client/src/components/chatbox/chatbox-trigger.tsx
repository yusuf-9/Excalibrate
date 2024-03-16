// components
import { Sidebar } from "@excalidraw/excalidraw";

// icons
import { BiMessageDetail } from "react-icons/bi";

export const ChatboxTrigger = () => {

  return (
    <>
      <Sidebar.Trigger
        name="chat"
        className="flex gap-2 items-center bg-accent text-contrast-dark rounded-lg p-3"
        title={"Open Chat"}
        icon={<BiMessageDetail />}
        style={{ backgroundColor: "rgb(168, 165, 255)", color: "black" }}
        >
        Chats
      </Sidebar.Trigger>
    </>
  );
};
