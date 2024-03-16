import React, { createContext, useEffect, useState } from 'react';
import { io as socketIO, Socket } from 'socket.io-client';

// Create the context
interface SocketContextProps {
    socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps>({
    socket: null,
});

type SocketProviderProps = {   children: React.ReactNode };  

// Create the provider component
const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);


    useEffect(() => {
        // Connect to the Socket.io server
        const socketInstance = socketIO('http://localhost:3000');

        socketInstance.on('connect', () => {
            console.log('Connected to Socket.io server');
        });

        // Save the socket instance in state
        setSocket(socketInstance);

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from Socket.io server');
        });

        // Clean up the socket connection on component unmount
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
