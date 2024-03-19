import { useState } from "react";
import { ConferenceRoom, ConferenceActions } from "./components";

// types
type Props = {
  isModalDocked: boolean
}

function ConferenceContainer(props: Props) {
  const { isModalDocked } = props;

  const [participants, setParticipants] = useState([1, 2, 3, 4, 5, 6]);

  const shouldRenderActions = participants?.length && !isModalDocked;

  return (
    <main className="flex flex-col h-full gap-5">
      <ConferenceRoom
        participants={participants}
        setParticipants={setParticipants}
        renderOnlyUserStream={isModalDocked}
        />
      {shouldRenderActions && <ConferenceActions /> }
    </main>
  );
}

export default ConferenceContainer;
