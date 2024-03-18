import { createContext } from "react";

// types
import { SocketContextProps } from "./types";

export const SocketContext = createContext<SocketContextProps>({
    socket: null,
});