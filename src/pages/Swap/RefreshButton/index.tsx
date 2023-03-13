import { useEffect, useState } from 'react';

import { useWalletKit } from '@mysten/wallet-kit';

import { ReactComponent as RefreshIcon } from 'assets/images/refresh.svg';
import Tooltip from 'components/Tooltip';

import styles from './style.module.css';

type Props = {
  onClick: () => void;
};

function RefreshButton({ onClick }: Props) {
  const [isClicked, setIsClicked] = useState(false);
  const { isConnected } = useWalletKit();

  useEffect(() => {
    if (isClicked) {
      const timeoutId = setTimeout(() => setIsClicked(false), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isClicked]);

  return (
    <Tooltip.Provider>
      <Tooltip.Trigger
        onClick={() => {
          onClick();

          if (isConnected) {
            setIsClicked(true);
          }
        }}
        className={styles.iconButton}
      >
        <RefreshIcon className={isClicked ? styles.iconRotate : styles.icon} />
      </Tooltip.Trigger>
      <Tooltip.Consumer>
        The prices are refreshed every 20 seconds or manually refreshed by
        pressing this
      </Tooltip.Consumer>
    </Tooltip.Provider>
  );
}

export default RefreshButton;
