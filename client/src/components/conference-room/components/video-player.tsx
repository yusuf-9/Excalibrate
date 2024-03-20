import { memo } from "react"

type Props = {
    stream: MediaStream
}

function VideoPlayer(props: Props) {
  return (
    <div>VideoPlayer</div>
  )
}

export default memo(VideoPlayer);