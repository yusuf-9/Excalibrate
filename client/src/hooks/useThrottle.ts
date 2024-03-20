import { useCallback, useRef } from "react";

export function useThrottledCallback<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          timeoutRef.current = null;
        }, delay);
      }
    },
    [callback, delay]
  );

  return throttledCallback as T;
}
