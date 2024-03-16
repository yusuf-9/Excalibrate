import clsx from "clsx"

export const join = (...args: string[]) => clsx(...args);

export const getOffsets = (parent: HTMLElement, child: HTMLElement) => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  return {
    top: parentRect.top - childRect.top,
    right: parentRect.right - childRect.right,
    bottom: parentRect.bottom - childRect.bottom,
    left: parentRect.left - childRect.left,
  };
};

export const getValueFromLocalStorage = (key: string) => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}