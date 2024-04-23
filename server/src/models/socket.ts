import { Socket, Server } from "socket.io";

// core logic
import SocketEvents from "../core/socket";

class SocketEventListener {
  private socket: Server;

  constructor(socketInstance: Server) {
    this.socket = socketInstance;
    this.bindDefaultEvents();
  }

  private bindDefaultEvents(): void {
    this.socket.on("connection", (socketConnection: Socket) => {
      const socketEvents = new SocketEvents(this.socket, socketConnection);
      socketEvents?.getEvents()?.forEach(([key, handler]: [string, (args?: any) => void]) => socketConnection?.on(key, handler));
    });
  }

  addEventListener(event: string, cb: (socket: Socket) => void) {
    this.socket.on(event, cb);
  }
}

export default SocketEventListener;
