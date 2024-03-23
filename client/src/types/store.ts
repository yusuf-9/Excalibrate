export type ThemeOptions = "light" | "dark";

export type ConferenceModalStateType = {
  open: boolean;
  docked: boolean;
};

export type UserType = null | {
  socketId: string;
  name: string;
};