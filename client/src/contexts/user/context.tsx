import { createContext } from "react";

// types
import { UserContextProps } from "./types";

export const UserContext = createContext<UserContextProps>({
    user: null,
    collaborators: [],
    handleJoinRoom: () => {},
  });
  