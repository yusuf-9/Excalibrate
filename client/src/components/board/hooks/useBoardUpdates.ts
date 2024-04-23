import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";

// constants
import { THEME, getSceneVersion } from "@excalidraw/excalidraw";

// types
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { UserType } from "@/types/store";
import { COLOR_MAP } from "@/constants";

type propTypes = {
  excalidrawAPI: ExcalidrawImperativeAPI | undefined;
  activeTheme: string;
  socket: Socket | null;
  collaborators: UserType[];
};

type ExcalidrawPointerUpdateHandlerProps = {
  pointer: {
    x: number;
    y: number;
    tool: "pointer" | "laser";
  };
  button: "up" | "down";
  pointersMap: Map<
    number,
    Readonly<{
      x: number;
      y: number;
    }>
  >;
};

let lastRecievedOrBroadcastedSceneVersion = 0;

export const useBoardUpdates = ({ excalidrawAPI, activeTheme, socket, collaborators }: propTypes) => {
  // board change handler
  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[]) => {
      const sceneVersion = getSceneVersion(elements);
      if (sceneVersion > lastRecievedOrBroadcastedSceneVersion) {
        socket?.emit("board-update", elements);
        lastRecievedOrBroadcastedSceneVersion = sceneVersion;
      }
    },
    [socket]
  );

  // function to sync remote board with local board
  const syncBoard = useCallback(
    (elements: ExcalidrawElement[]) => {
      lastRecievedOrBroadcastedSceneVersion = getSceneVersion(elements);
      excalidrawAPI?.updateScene({
        elements: elements,
        commitToHistory: false,
      });
    },
    [excalidrawAPI]
  );

  // function to emit  pointer position to other users
  const handleEmitPointerState = useCallback(
    (payload: ExcalidrawPointerUpdateHandlerProps) => {
      socket?.emit("pointer-update", payload?.pointer);
    },
    [socket]
  );

  // function to update remote pointers
  const updateRemotePointers = useCallback(
    (payload: { pointer: ExcalidrawPointerUpdateHandlerProps["pointer"]; socketId: string }) => {
      const currentCollaborators = excalidrawAPI?.getAppState()?.collaborators;
      const collaborator = currentCollaborators?.get(payload?.socketId);
      if (!collaborator) return;

      currentCollaborators?.set(payload?.socketId, {
        ...collaborator,
        pointer: payload?.pointer,
      });

      excalidrawAPI?.updateScene({
        collaborators: currentCollaborators,
      });
    },
    [excalidrawAPI]
  );

  // effect for initializing socket event listeners
  useEffect(() => {
    socket?.on("board-change", syncBoard);
    socket?.on("pointer-update", updateRemotePointers);

    return () => {
      socket?.off("board-change", syncBoard);
      socket?.off("pointer-update", updateRemotePointers);
    };
  }, [socket, syncBoard, updateRemotePointers]);

  // Effect to update the theme of the board
  useEffect(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: {
        theme: activeTheme === "dark" ? THEME.DARK : THEME.LIGHT,
      },
    });
  }, [activeTheme, excalidrawAPI]);

  // effect to update the collaborators list
  useEffect(() => {
    if (!collaborators?.length) {
      // If no collaborators are present, update the scene with an empty collaborators map
      excalidrawAPI?.updateScene({
        collaborators: new Map(),
      });
      return;
    }
  
    // Get the current collaborators from the Excalidraw API
    const currentCollaboratorsMap = new Map(excalidrawAPI?.getAppState()?.collaborators);
  
    // Iterate over the current collaborators in the Excalidraw state
    currentCollaboratorsMap.forEach((collaborator, socketId) => {
      // Check if the collaborator's socketId exists in the current collaborators array
      const existsInRoom = collaborators.some(collab => collab.socketId === socketId);
      
      // If the collaborator is no longer in the room, remove them from the Excalidraw state
      if (!existsInRoom) {
        currentCollaboratorsMap.delete(socketId);
      }
    });
  
    // Iterate over the collaborators array and add new collaborators to the Excalidraw state
    collaborators.forEach(collaborator => {
      // Check if the collaborator's socketId exists in the current collaborators map
      if (!currentCollaboratorsMap.has(collaborator.socketId)) {
        currentCollaboratorsMap.set(collaborator.socketId, {
          id: collaborator.socketId,
          username: collaborator.name,
          color: {
            background: COLOR_MAP[Math.floor(Math.random() * COLOR_MAP.length - 1)],
            stroke: "#FFFFFF",
          },
        });
      }
    });
  
    // Update the scene with the updated collaborators map
    excalidrawAPI?.updateScene({
      collaborators: currentCollaboratorsMap,
    });
  }, [collaborators, excalidrawAPI]);

  return {
    handleChange,
    handleEmitPointerState,
  };
};
