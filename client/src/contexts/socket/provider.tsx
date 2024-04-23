import { useEffect, useState } from 'react';
import { io as socketIO, Socket } from 'socket.io-client';

// types
import { SocketProviderProps } from './types';

// context
import { SocketContext } from './context';

const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = socketIO('http://localhost:3000');

        socketInstance.on('connect', () => {
            setSocket(socketInstance);
        });
        socketInstance.on('disconnect', () => {
            socket.emit('user-disconnected')
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
};

export default SocketProvider;