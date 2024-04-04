import { useState } from "react";
import { useRecoilValue } from "recoil";

// hooks
import { useStore } from "@/hooks/useStore";
import { useUser } from "@/hooks/useUser";
import { useSocket } from "@/hooks/useSocket";

// types
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

export const useBoardState = () => {
  const { themeAtom } = useStore();
  const activeTheme = useRecoilValue(themeAtom);

  const { collaborators } = useUser();
  const {socket} = useSocket()

  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();


  return {
    activeTheme,
    collaborators,
    excalidrawAPI,
    socket,
    setExcalidrawAPI,
  }
};
