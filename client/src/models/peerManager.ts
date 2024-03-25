import Peer from "peerjs";
import { Socket } from "socket.io-client";

export type ServerPeerResponse = {
  peerId: string;
  socketId: string;
};

class PeerManager {
  private peerInstance: Peer;
  private localStream: MediaStream;

  constructor(localStream: MediaStream) {
    this.peerInstance = new Peer();
    this.localStream = localStream;
  }

  initializeConnection(socket: Socket, user: any, collaborators: any, setParticipants: any) {
    this.peerInstance.on("open", async (id: string) => {
      const remotePeers: ServerPeerResponse[] = await socket?.emitWithAck("peer-connected", id);
      setParticipants([
        {
          socketId: user!.socketId,
          peerId: id,
          name: user!.name,
          stream: this.localStream,
          streamType: "audio",
        },
      ]);
      const remotePeerConnections = this.getPeerConnections(remotePeers, collaborators);
      this.callPeers(remotePeerConnections, setParticipants);
      this.listenToCalls(setParticipants);
      this.catchErrors();
    });
  }

  private getPeerConnections(remotePeers: any, collaborators: any) {
    return remotePeers?.map((peer: any) => ({
      socketId: peer.socketId,
      peerId: peer.peerId,
      name: collaborators?.find((collaborator: any) => collaborator?.socketId === peer.socketId)?.name || "",
      stream: null,
      streamType: "audio",
    }));
  }

  private callPeers(remotePeerConnections: any, setParticipants: any) {
    remotePeerConnections.forEach((peer: any) => {
      const call = this.peerInstance.call(peer?.peerId, this.localStream);
      
      call?.on("stream", remoteStream => {
        setParticipants((prev: any) => [
          ...prev,
          {
            ...peer,
            stream: remoteStream,
          },
        ]);
      });
    });
  }

  private listenToCalls(setParticipants: any) {
    this.peerInstance.on("call", incomingCall => {
      incomingCall.answer(this.localStream);

      incomingCall.on("stream", remoteStream => {
        setParticipants((prevParticipants: any) => {
          return prevParticipants.map((participant: any) => {
            if (participant.peerId === incomingCall.peer) {
              return {
                ...participant,
                stream: remoteStream,
              };
            }
            return participant;
          });
        });
      });
    });
  }

  private catchErrors() {
    this.peerInstance.on("error", err => {
      console.error("PeerJS error:", err);
    });
  }
}

export default PeerManager;
