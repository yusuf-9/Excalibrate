import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";

// components
import ChatboxSidebar from "@/components/chatbox";

const Board = (props: ExcalidrawProps) => {
  return (
    <Excalidraw {...props} >
      <ChatboxSidebar />
      <WelcomeScreen />
    </Excalidraw>
  );
};

export default Board;
