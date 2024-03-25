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

  private handleJoinRoom({ name, roomId }: { name: string; roomId?: string }) {
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

  private handleRecieveMessage({ message }: { message: string }) {
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

  private handleSocketDisconnect() {
    const room = this.getUserRoom(this.socket?.id);
    if (!room) return;

    this.removeUserFromRoom(room.id)

    this.socket.leave(room.id);
  }

  private handleConnectPeer(peerId: string, ack: Function){
    const room = this.getUserRoom(this.socket?.id);
    if (!room) return;

    store[room.id].conferenceMembers.add({
      peerId,
      socketId: this.socket?.id,
    });

    ack(
      Array.from(store[room.id].conferenceMembers)
      ?.filter(member => member?.peerId !== peerId)
    )
    
    this.socket.broadcast.to(room.id).emit(
      "new-peer-connected", Array.from(store[room.id].conferenceMembers)
    );
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

  private removeUserFromRoom(roomId: string){
    const newConnectionList = Array.from(store[roomId].connections)?.filter(user => user.socketId !== this.socket?.id);
    if(!newConnectionList?.length) {
        return delete store[roomId];
    }

    const newConferenceMembersList = Array.from(store[roomId].conferenceMembers)?.filter(user => user.socketId !== this.socket?.id);
    store[roomId].connections = new Set(newConnectionList);
    store[roomId].conferenceMembers = new Set(newConferenceMembersList);
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
      'peer-connected': this.createErrorBoundary(this.handleConnectPeer)
    });
  }
}

export default SocketEvents;
