import { useState } from "react";
import { themeContext } from "./themeContext";

const [theme, setTheme] = useState("dark");

function toggleTheme(){
    if(theme === "dark"){
        setTheme("light");
    }else{
        setTheme("dark");
    }
}

export default function ({children}){
    return <themeContext.Provider value={{theme, toggleTheme}} >
        {children}
    </themeContext.Provider>
}
