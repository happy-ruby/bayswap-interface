import { useWalletKit } from '@mysten/wallet-kit';

import styles from './style.module.css';
import supportedWallets from './supportedWallets';

type Props = {
  close: () => void;
};

function WalletList({ close }: Props) {
  const { wallets, connect } = useWalletKit();
  const installedWallets = wallets.map(({ name }) => name);

  return (
    <div className={styles.container}>
      {supportedWallets.map(
        ({ name, icon, installLink, recommended, display }, index) => (
          <div key={index} className={styles.wallet}>
            <div className={styles.walletInfo}>
              <img src={icon} alt={name} className={styles.walletImage} />
              <div>
                <span>{display}</span>
                <div>{recommended ? '(Recommended)' : ''}</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (!installedWallets.includes(name)) {
                  window.open(installLink);
                } else {
                  connect(name).then(close);
                }
              }}
              className={
                installedWallets.includes(name)
                  ? styles.button
                  : styles.buttonInstall
              }
            >
              {installedWallets.includes(name) ? 'Connect' : 'Install'}
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default WalletList;
