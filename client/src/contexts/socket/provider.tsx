import { useEffect, useState } from 'react';
import { io as socketIO, Socket } from 'socket.io-client';

// types
import { SocketProviderProps } from './types';

// context
import { SocketContext } from './context';

const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = socketIO('https://excalibrate.onrender.com/');

        socketInstance.on('connect', () => {
            console.log('Connected to Socket.io server');
            setSocket(socketInstance);
        });
        socketInstance.on('disconnect', () => {
            console.log('Disconnected from Socket.io server');
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