import { useState } from "react";
import { useRecoilValue } from "recoil";

// hooks
import { useStore } from "@/hooks/useStore";
import { useUser } from "@/hooks/useUser";

// types
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

export const useBoardState = () => {
  const { themeAtom } = useStore();
  const activeTheme = useRecoilValue(themeAtom);

  const { collaborators } = useUser();
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();


  return {
    activeTheme,
    collaborators,
    excalidrawAPI,
    setExcalidrawAPI,
  }
};
