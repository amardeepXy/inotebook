import {createContext, useContext} from "react";

export const authContext = createContext();

const useAuthContext = () => {
    return useContext(authContext);
}

export default useAuthContext;