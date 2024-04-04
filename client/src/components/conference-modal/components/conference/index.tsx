// components
import { ConferenceActions, JoinRoom } from "./components";
import ConferenceRoom from "@/components/conference-room";

// hooks
import { useConference } from "../../hooks/useConference";

// types
type Props = {
  isModalDocked: boolean;
};

function ConferenceContainer(props: Props) {
  const { isModalDocked } = props;

  const {
    participants,
    collaborators,
    socket,
    muted,
    setParticipants,
    handleInitializePeer,
    handleEndCall,
    handleMuteToggle,
  } = useConference();

  const shouldRenderActions = participants?.length && !isModalDocked;

  return (
    <main className="flex flex-col h-full gap-5">
      {!participants?.length && <JoinRoom onClick={handleInitializePeer} />}
      {!!participants?.length && (
        <ConferenceRoom
          participants={participants}
          setParticipants={setParticipants}
          renderOnlyUserStream={isModalDocked}
          localSocketId={socket?.id}
        />
      )}
      {!!shouldRenderActions && (
        <ConferenceActions
          muted={muted}
          onMute={handleMuteToggle}
          onEnd={handleEndCall}
        />
      )}
    </main>
  );
}

export default ConferenceContainer;
