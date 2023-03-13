import { ReactComponent as MoonIcon } from 'assets/images/moon.svg';
import { ReactComponent as SunIcon } from 'assets/images/sun.svg';
import { ReactComponent as SystemIcon } from 'assets/images/system.svg';
import { ThemeMode } from 'constant';
import useTheme from 'hooks/useTheme';

import styles from './style.module.css';

function Setting() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>

      <p className={styles.subtitle}>Theme</p>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => setTheme(ThemeMode.Light)}
          className={
            theme === ThemeMode.Light
              ? styles.themeButtonActive
              : styles.themeButton
          }
        >
          <SunIcon />
          <span>Light</span>
        </button>
        <button
          onClick={() => setTheme(ThemeMode.Dark)}
          className={
            theme === ThemeMode.Dark
              ? styles.themeButtonActive
              : styles.themeButton
          }
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
        <button
          onClick={() => setTheme(ThemeMode.System)}
          className={
            theme === ThemeMode.System
              ? styles.themeButtonActive
              : styles.themeButton
          }
        >
          <SystemIcon />
          <span>System</span>
        </button>
      </div>
    </div>
  );
}

export default Setting;
