import ThemeToggle from '@/components/theme';
import { ChatboxTrigger } from '@/components/chatbox';
import { LiveCollaborationTrigger } from '@excalidraw/excalidraw';

const TopRightUi = ({isCollaborating} : {isCollaborating : boolean}) => {
  return (
    <div className="flex gap-2">
    <LiveCollaborationTrigger
       isCollaborating={isCollaborating}
       onSelect={() => {
         window.alert("You clicked on collab button");
       }}
     />
   <ThemeToggle className='w-9 h-9 flex justify-center items-center'/>
   <ChatboxTrigger />
 </div>
  )
}

export default TopRightUi