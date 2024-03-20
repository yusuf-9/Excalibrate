import { memo } from "react";

// components
import AudioPlayer from "./audio-player";
import VideoPlayer from "./video-player";

// types
type Props = {
  color: string;
  name: string;
  stream: MediaStream;
  streamType: "audio" | "video";
};

function StreamPlayer(props: Props) {
  const { color, name, stream, streamType } = props;

  const avatarName = name?.split(' ')?.[0]?.[0] + (name?.split(' ')?.[1]?.[0] || '')

  return (
    <div className={`w-full h-full col-span-1 flex justify-center items-center rounded-xl bg-gray-600 text-white`}>
      {streamType === "audio" && (
        <AudioPlayer 
          color={color}
          name={avatarName}
          stream={stream}
        />
      )}
      {streamType === "video" && (
        <VideoPlayer 
          stream={stream}
        />
      )}
    </div>
  );
}

export default memo(StreamPlayer);
