// custom models
import SocketServer from './models/server';
import SocketEventListener from './models/socket';

// initialize server
const server = new SocketServer(
  process.env.PORT || 3000,
  'http://localhost:5173'
);

new SocketEventListener(server.io);