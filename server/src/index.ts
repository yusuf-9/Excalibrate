import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';
import cors from 'cors';

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Change '*' to your desired origin
    methods: ['GET', 'POST'] // Adjust methods as needed
  }
});

// store
const socketConnections = new Set<{
  socketId: string;
  name: string;
  roomId: string;
}>();

const chatMessages = new Set<{
  message: string;
  author: string;
  authorId: string;
  roomId: string;
}>()

// Socket.IO events
io.on("connection", (socket: Socket) => {
  // when initial connection is made
  console.log("a user connected", socket?.id);

  socket.on("join-room", ({ name, roomId }) => {
    try {
      const newRoomId = roomId ?? v4();
      const userData = {
        socketId: socket.id,
        name,
        roomId: newRoomId,
      };
      socket.join(newRoomId);
      socketConnections.add(userData);
      socket.emit("user-joined-room", userData); // Notify new user that he has joined the room
      socket.broadcast.to(newRoomId).emit("new-user-joined-room", userData); // Notify existing users that a new user has joined their room
      socket.emit("chat-history", Array.from(chatMessages)?.filter(({roomId}) => roomId === newRoomId));
      console.log("emitting chat history")
    } catch (error) {
      console.log({ error });
    }
  });

  socket.on("message", ({ message }) => {
    try {
      const socketConnectsArray = Array.from(socketConnections);
      const userConnection = socketConnectsArray.find(({ socketId }) => socketId === socket.id);
      if(!userConnection) return;
      
      const { socketId, roomId, name } = userConnection;
      const messagePayload = {
        message, author: name, authorId: socketId, roomId
      }
      chatMessages.add(messagePayload);
      io.to(roomId).emit("message-recieved", messagePayload);
    } catch (error) {
      console.log({ error });
    }
  });

  socket.on("disconnect", () => {
    socketConnections.forEach(connection => {
      if (connection.socketId === socket.id) {
        socketConnections.delete(connection);
      }
    })
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
