import { Socket } from "socket.io";

export const useSocketEvent = (socket: Socket, event: string, callBack: (socket: Socket) => void) => {
  socket.on(event, callBack);
};
