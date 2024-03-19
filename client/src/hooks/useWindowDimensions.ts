import { useEffect, useRef } from "react";

export function useWindowDimensions() {
  const windowDimensions = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      windowDimensions.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowDimensions.current;
}
