import { v4 } from "uuid";
import { Server, Socket } from "socket.io";

// store
import store from "../store";

class SocketEvents {
  private socket: Socket;
  private io: Server;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  handleJoinRoom({ name, roomId }: { name: string; roomId?: string }) {
    const newRoomId = roomId ?? v4();
    this.createRoom(newRoomId);

    const user = { socketId: this.socket?.id, name };
    store[newRoomId].connections.add(user);
    this.socket.join(newRoomId);

    const roomChatMessages = this.getRoomChatMessages(newRoomId);

    this.io.to(newRoomId).emit(
      "joined-room", [Array.from(store[newRoomId].connections), newRoomId]
      );

    this.socket.emit("chat-history", roomChatMessages);
  }

  handleRecieveMessage({ message }: { message: string }) {
    const messagePayload = {
      content: message,
      socketId: this.socket?.id,
      timestamp: Date.now(),
    };

    const room = this.getUserRoom(this.socket?.id);
    if (!room) return;

    store[room.id].messages.add(messagePayload);
    this.io.to(room.id).emit("message-received", messagePayload);
  }

  handleSocketDisconnect() {
    const room = this.getUserRoom(this.socket?.id);
    if (!room) return;

    const newConnectionList = Array.from(store[room.id].connections)?.filter(user => user.socketId !== this.socket?.id);
    if(!newConnectionList?.length) {
        return this.deleteRoom(room.id);
    }

    store[room.id].connections = new Set(newConnectionList);
    this.socket.leave(room.id);
  }

  private createRoom(roomId: string) {
    if (store[roomId]) return;
    store[roomId] = {
      id: roomId,
      connections: new Set(),
      conferenceMembers: new Set(),
      messages: new Set(),
    };
  }

  private getRoomChatMessages(roomId: string) {
    return Array.from(store[roomId].messages);
  }

  private getUserRoom(socketId: string) {
    return Object.values(store)?.find(room => Array.from(room?.connections)?.some(user => user.socketId === socketId));
  }

  private deleteRoom(roomId: string) {
    delete store[roomId];
  }

  private createErrorBoundary(handler: Function) {
    return (...args: any[]) => {
      try {
        handler.apply(this, args);
      } catch (error) {
        console.error(error);
      }
    };
  }

  getEvents() {
    return Object.entries({
      "join-room": this.createErrorBoundary(this.handleJoinRoom),
      message: this.createErrorBoundary(this.handleRecieveMessage),
      disconnect: this.createErrorBoundary(this.handleSocketDisconnect),
    });
  }
}

export default SocketEvents;
