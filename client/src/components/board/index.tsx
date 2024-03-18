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
    setExcalidrawAPI,
  } = useBoardState();

  useBoardUpdates({
    excalidrawAPI,
    activeTheme,
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
      />
    </main>
  );
};

export default BoardContainer;
