import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

class SocketServer {
  private app: express.Application;
  private server: http.Server;
  public io: SocketIOServer;

  constructor(port: string | number, originURI: string) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: originURI,
        methods: ["GET", "POST"],
      },
    });

    this.server.listen(port, () => {
      console.log(`Socket server listening on port ${port}`);
    });
  }
}

export default SocketServer;