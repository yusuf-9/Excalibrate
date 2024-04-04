import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";

// constants
import { THEME, getSceneVersion } from "@excalidraw/excalidraw";


// types
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

type propTypes = {
  excalidrawAPI: ExcalidrawImperativeAPI | undefined;
  activeTheme: string;
  socket: Socket | null
};

let lastRecievedOrBroadcastedSceneVersion = 0;

export const useBoardUpdates = ({ excalidrawAPI, activeTheme, socket }: propTypes) => {

  // board change handler
  const handleChange = useCallback((elements: readonly ExcalidrawElement[]) => {
    console.log(getSceneVersion(elements))
    if(getSceneVersion(elements) > lastRecievedOrBroadcastedSceneVersion) {
      console.log("on change");
      // emit event
      socket?.emit('board-update', elements);
      
      lastRecievedOrBroadcastedSceneVersion = getSceneVersion(elements)
    }
  }, [socket]);

  // function to sync remote board with local board
  const syncBoard = useCallback((elements: ExcalidrawElement[]) => {
    console.log("on sync")
      lastRecievedOrBroadcastedSceneVersion = getSceneVersion(elements)
      excalidrawAPI?.updateScene({
        elements: elements,
        commitToHistory: false
      })
  }, [excalidrawAPI]);

  // effect for initializing socket event listeners
  useEffect(() => {
    socket?.on('board-change', syncBoard);

    return () => {
      socket?.off('board-change', syncBoard);
    }
  }, [socket, syncBoard])

  // Effect to update the theme of the board
  useEffect(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: {
        theme: activeTheme === "dark" ? THEME.DARK : THEME.LIGHT,
      },
    });
  }, [activeTheme, excalidrawAPI]);

  return {
    handleChange
  };
};
