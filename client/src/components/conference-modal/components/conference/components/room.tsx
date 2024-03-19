import { COLOR_MAP } from "@/constants";

// types
type Props = {
  participants: any[];
  setParticipants: React.Dispatch<React.SetStateAction<any[]>>;
  renderOnlyUserStream: boolean
};

function ConferenceRoom(props: Props) {
  const { participants, setParticipants, renderOnlyUserStream} = props;

  const columns = renderOnlyUserStream ? 1 : Math.ceil(participants.length / 2);

  return (
    <section className={`w-full flex-grow grid grid-cols-${columns} gap-2 transition-all`}>
      {participants?.slice(0, renderOnlyUserStream ? 1 : participants?.length)?.map((participant, index) => (
        <div
          key={index}
          className={`w-full h-full col-span-1 flex justify-center items-center rounded-xl bg-gray-600 text-white`}
        >
          <div 
            className="relative inline-flex items-center justify-center w-32 h-32 overflow-hidden rounded-full"
            style={{
                backgroundColor: COLOR_MAP[index]
            }}
          >
            <h3 className="text-[60px] pb-2">{participant}</h3>
          </div>
        </div>
      ))}
    </section>
  );
}

export default ConferenceRoom;
