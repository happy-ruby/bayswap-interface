import { useCallback } from 'react';

import { Network } from 'constant';
import useSDK from 'hooks/useSDK';

import styles from './style.module.css';

function ToggleNetwork() {
  const { sdk, changeSDK } = useSDK();

  const changeNetwork = useCallback(
    (network: Network) => {
      if (sdk._network === network) {
        return;
      }

      changeSDK(network);
    },
    [changeSDK, sdk._network]
  );

  return (
    <div className={styles.buttonGroup}>
      {[Network.TESTNET, Network.DEVNET].map((network, index) => (
        <button
          key={index}
          onClick={() => changeNetwork(network)}
          className={
            network === sdk._network ? styles.activeButton : styles.button
          }
        >
          {network}
        </button>
      ))}
    </div>
  );
}

export default ToggleNetwork;
