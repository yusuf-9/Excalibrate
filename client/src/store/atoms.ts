import { atom } from "recoil";

// types
import { ConferenceModalStateType, ThemeOptions, UserType } from "@/types/store";  

// constants
import { THEME_OPTIONS } from "@/constants";

// atoms ----------------------------------------------------------------

// Theme atom
export const themeAtom = atom<ThemeOptions>({
  key: "activeTheme",
  default: THEME_OPTIONS.LIGHT,
});

// Chat Drawer atom
export const chatDrawerAtom = atom<boolean>({  
  key: "chatDrawerDocked",
  default: false,
}); 

// Conference Modal atom
export const conferenceModalAtom = atom<ConferenceModalStateType>({  
  key: "conferenceModal",
  default: {
    open: false,
    docked: false,
  },
});

// User atom
export const userAtom = atom<UserType>({
  key: "user",
  default: null,
});

// Users atom
export const collaboratersAtom = atom<UserType[]>({ 
  key: "collaboraters",
  default: [],
});