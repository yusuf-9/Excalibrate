import { Participant } from "../hooks/useConference";

export function getLocalStream(participants: Participant[], socketId: string | undefined){
    return participants.find(participant => participant.socketId === socketId)?.stream;
}