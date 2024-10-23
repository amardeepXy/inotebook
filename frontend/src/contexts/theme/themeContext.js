import { createContext, useContext } from "react";

export const themeContext = createContext({
    theme: "",
    toggleTheme: () => {}
});

const useThemeContext = ()=>
     useContext(themeContext);


export default useThemeContext;