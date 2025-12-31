import { createContext, useContext } from "react";

export const ThemeModeContext = createContext({
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);
