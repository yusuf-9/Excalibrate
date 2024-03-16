// components
import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import ChatboxSidebar from "@/components/chatbox";
import { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";

const Board = (props: ExcalidrawProps) => {
  return (
    <Excalidraw {...props} >
      <ChatboxSidebar />
      <WelcomeScreen />
    </Excalidraw>
  );
};

export default Board;
