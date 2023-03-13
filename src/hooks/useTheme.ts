import { useContext } from 'react';

import { ThemeContext } from 'contexts/theme';

function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error(
      'You must call `useTheme` within the of the `ThemProvider`.'
    );
  }

  return theme;
}

export default useTheme;
