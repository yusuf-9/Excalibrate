export type Connection = {
    socketId: string;
    name: string;
}

export type ConferenceMember = {
    socketId: string;
    peerId: string
}

export type Message = {
    socketId: string;
    content: string;
    timestamp: number;
}

export interface Store {
    [roomId: string]: {
        id: string;
        connections: Set<Connection>;
        conferenceMembers: Set<ConferenceMember>;
        messages: Set<Message>;
    }
}