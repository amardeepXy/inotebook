import { useState } from "react";
import { authContext } from "./authContext";

export default function ({children}){

    const [authState, setAuthState] = useState({
        userData: null,
        isAuthenticated: false
    });

    function setLogin(data){
        if(!data)  throw new Error('user data is needed to login user in auth context');
        setAuthState({userData: {...data}, isAuthenticated: true});
    }

    function setLogout(){
        setAuthState({userData: null, isAuthenticated: false});
    }

    return <authContext.Provider value={{...authState, setLogin, setLogout}}>
        {children}
    </authContext.Provider>
}