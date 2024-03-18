import { UserType } from "@/types/store";

// context values type
export interface UserContextProps {
    user: UserType | null;
    collaborators: UserType[];
    handleJoinRoom: (data: { name: string; roomId?: string }) => void;
  }
  

export type UserProviderProps = { children: React.ReactNode };
