import { useEffect } from "react";

// constants
import { THEME } from "@excalidraw/excalidraw";

// types
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

type propTypes = {
  excalidrawAPI: ExcalidrawImperativeAPI | undefined;
  activeTheme: string;
};

export const useBoardUpdates = ({ excalidrawAPI, activeTheme }: propTypes) => {
  // Effect to update the theme of the board
  useEffect(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: {
        theme: activeTheme === "dark" ? THEME.DARK : THEME.LIGHT,
      },
    });
  }, [activeTheme, excalidrawAPI]);

  return null;
};
