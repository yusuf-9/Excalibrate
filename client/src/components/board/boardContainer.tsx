import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

// components
import Board from "./board";
import TopRightUi from "./top-right-ui";

// constants
import { THEME } from "@excalidraw/excalidraw";

// store
import { useStore } from "@/hooks/useStore";
import { useUser } from "@/hooks/useUser";

//types
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

const BoardContainer = () => {
  const { themeAtom } = useStore();
  const activeTheme = useRecoilValue(themeAtom);

  const { collaborators } = useUser();
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  // Effect to update the theme of the board
  useEffect(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: {
        theme: activeTheme === "dark" ? THEME.DARK : THEME.LIGHT,
      },
    });
  }, [activeTheme, excalidrawAPI]);

  // Function to render the top right UI
  const getTopRightUI = useCallback(() => {
    return <TopRightUi isCollaborating={collaborators?.length > 0} />;
  }, [collaborators?.length]);

  return (
    <main className="h-screen w-screen">
      <Board
        initialData={{
          appState: {
            theme: activeTheme === "dark" ? THEME.DARK : THEME.LIGHT,
            defaultSidebarDockedPreference: false,
          },
        }}
        renderTopRightUI={getTopRightUI}
        excalidrawAPI={setExcalidrawAPI}
      />
    </main>
  );
};

export default BoardContainer;
