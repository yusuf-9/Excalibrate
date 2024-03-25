import { memo, useEffect, useRef } from "react";

// hooks
import { useThrottledCallback } from "@/hooks/useThrottle";

// models
import Microphone from "@/models/microphone";

// types
type Props = {
  color: string;
  name: string;
  stream: MediaStream;
  outputAudio: boolean;
};

// constants
const AVATAR_WIDTH = 128;
const AVATAR_HEIGHT = 128;

function AudioPlayer(props: Props) {
  const { color, name, stream, outputAudio } = props;

  const pulsatorEl = useRef<HTMLDivElement>(null);
  const audioOutputEl = useRef<HTMLAudioElement>(null);

  const handleMicrophoneVolumeChange = useThrottledCallback((event: AudioProcessingEvent) => {
    const buffer = event.inputBuffer.getChannelData(0);
    const sum = buffer.reduce((acc, val) => acc + Math.abs(val), 0);
    const pulsatingFactor = sum / buffer.length;

    if (pulsatorEl.current) {
      pulsatorEl.current.style.width = AVATAR_WIDTH + pulsatingFactor * 500 + "px";
      pulsatorEl.current.style.height = AVATAR_HEIGHT + pulsatingFactor * 500 + "px";
    }
  }, 100);

  useEffect(() => {
    const microphone: Microphone = new Microphone(stream, handleMicrophoneVolumeChange);

    if (audioOutputEl.current && outputAudio) audioOutputEl.current.srcObject = stream;
    return () => {
      microphone.close();
    };
  }, [handleMicrophoneVolumeChange, stream, outputAudio]);

  return (
    <>
      <audio
        autoPlay={true}
        controls={false}
        ref={audioOutputEl}
      ></audio>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all rounded-full bg-gray-400 opacity-50 border border-white"
        style={{
          width: AVATAR_WIDTH,
          height: AVATAR_HEIGHT,
        }}
        ref={pulsatorEl}
      />
      <div
        className="inline-flex items-center justify-center overflow-hidden rounded-full z-50"
        style={{
          backgroundColor: color,
          width: AVATAR_WIDTH,
          height: AVATAR_HEIGHT,
        }}
      >
        <h3 className="text-[60px] pb-2 uppercase">{name}</h3>
      </div>
    </>
  );
}

export default memo(AudioPlayer);
