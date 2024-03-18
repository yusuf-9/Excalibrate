import { useContext } from "react";

import { UserContext } from "@/contexts/user";

export const useUser = () => {  
    const { ...rest } = useContext(UserContext);
    return {
       ...rest
    };
}
