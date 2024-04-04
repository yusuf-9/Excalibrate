import { useCallback } from "react";

// components
import {
  Board,
  TopRightUi,
} from "./components";

// constants
import { THEME } from "@excalidraw/excalidraw";

import { useBoardState } from "./hooks/useBoardState";
import { useBoardUpdates } from "./hooks/useBoardUpdates";

const BoardContainer = () => {
  const {
    collaborators,
    activeTheme,
    excalidrawAPI,
    socket,
    setExcalidrawAPI,
  } = useBoardState();

  const {
    handleChange
  } = useBoardUpdates({
    excalidrawAPI,
    activeTheme,
    socket
  });

  // Function to render the top right UI
  const getTopRightUI = useCallback(
    () => (
      <TopRightUi
        isCollaborating={
          collaborators?.length > 0
        }
      />
    ),
    [collaborators?.length]
  );

  return (
    <main className="h-screen w-screen">
      <Board
        initialData={{
          appState: {
            theme:
              activeTheme === "dark"
                ? THEME.DARK
                : THEME.LIGHT,
            defaultSidebarDockedPreference:
              false,
          },
        }}
        renderTopRightUI={getTopRightUI}
        excalidrawAPI={setExcalidrawAPI}
        onChange={handleChange}
        
      />
    </main>
  );
};

export default BoardContainer;
