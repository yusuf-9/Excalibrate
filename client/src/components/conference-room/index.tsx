// constants
import { COLOR_MAP } from "@/constants";

// types
import { Participant } from "@/components/conference-modal/hooks/useConference";
import StreamPlayer from "./components";
import { useMemo } from "react";

// types
type Props = {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  renderOnlyUserStream: boolean;
  localSocketId: string | undefined;
};

function ConferenceRoom(props: Props) {
  const { participants, setParticipants, renderOnlyUserStream, localSocketId } = props;

  const columns = renderOnlyUserStream ? 1 : Math.ceil(participants.length / 2);

  const userStreams = useMemo(
    () =>
      participants?.slice(0, renderOnlyUserStream ? 1 : participants?.length)?.map((participant, index) => (
        <StreamPlayer
          color={COLOR_MAP[index]}
          stream={participant.stream!}
          name={participant?.name}
          key={participant?.socketId}
          streamType={participant?.streamType}
          isLocalStream={participant?.socketId === localSocketId}
          muted={participant?.muted}
        />
      )),
    [participants, renderOnlyUserStream, localSocketId]
  );

  return <section className={`w-full flex-grow grid grid-cols-${columns} gap-2 transition-all`}>
    {userStreams}
  </section>;
}

export default ConferenceRoom;
