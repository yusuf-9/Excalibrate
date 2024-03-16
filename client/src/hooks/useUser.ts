import { useContext } from "react";

import { UserContext } from "@/providers/user";

export const useUser = () => {  
    const { ...rest } = useContext(UserContext);
    return {
       ...rest
    };
}
