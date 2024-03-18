import { Socket } from 'socket.io-client';

export interface SocketContextProps {
    socket: Socket | null;
}

export type SocketProviderProps = {   children: React.ReactNode };  
