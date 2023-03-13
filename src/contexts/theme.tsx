import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { ThemeMode } from 'constant';
import useLocalStorage from 'hooks/useLocalStorage';
import useMediaQuery from 'hooks/useMediaQuery';

type ContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

export const ThemeContext = createContext<ContextType | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('isDarkTheme', true);
  const [isSystemTheme, setIsSystemTheme] = useLocalStorage(
    'isSystemTheme',
    false
  );
  const matches = useMediaQuery('(prefers-color-scheme: dark)');

  const toggleDarkTheme = useCallback(
    (isDarkTheme: boolean) => {
      setIsDarkTheme(isDarkTheme);
      document.body.classList.add(
        isDarkTheme ? ThemeMode.Dark : ThemeMode.Light
      );
      document.body.classList.remove(
        isDarkTheme ? ThemeMode.Light : ThemeMode.Dark
      );
    },
    [setIsDarkTheme]
  );

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      if (theme === ThemeMode.System) {
        setIsSystemTheme(true);
      } else {
        setIsSystemTheme(false);
        setIsDarkTheme(theme === ThemeMode.Dark);
      }
    },
    [setIsDarkTheme, setIsSystemTheme]
  );

  const theme = useMemo(() => {
    if (isSystemTheme) {
      return ThemeMode.System;
    } else {
      return isDarkTheme ? ThemeMode.Dark : ThemeMode.Light;
    }
  }, [isDarkTheme, isSystemTheme]);

  useEffect(() => {
    if (isSystemTheme) {
      toggleDarkTheme(matches);
    } else {
      toggleDarkTheme(isDarkTheme);
    }
  }, [isDarkTheme, isSystemTheme, matches, toggleDarkTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
