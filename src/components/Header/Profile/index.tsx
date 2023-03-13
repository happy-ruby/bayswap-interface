import { useWalletKit } from '@mysten/wallet-kit';

import { ReactComponent as CopyIcon } from 'assets/images/copy.svg';
import { ReactComponent as ExternalLinkIcon } from 'assets/images/external-link.svg';
import { ReactComponent as PowerIcon } from 'assets/images/power.svg';
import { ReactComponent as SuiIcon } from 'assets/images/sui-wallet.svg';
import { SUI } from 'constant';
import useSDK from 'hooks/useSDK';
import useUser from 'hooks/useUser';
import { roundBalanceByType, shortenAddress } from 'utils/transform';

import styles from './style.module.css';

type Props = {
  close: () => void;
};

async function copyToClipboard(text: string | null) {
  if (!text) return;

  if (!navigator?.clipboard) {
    console.warn('Clipboard not supported');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
  }
}

function Profile({ close }: Props) {
  const { currentAccount, disconnect } = useWalletKit();
  const { sdk } = useSDK();
  const { balances } = useUser();
  const balance = roundBalanceByType(balances, SUI);

  return (
    <div className={styles.container}>
      <button
        onClick={() => copyToClipboard(currentAccount)}
        className={styles.copyButton}
      >
        <span>{currentAccount ? shortenAddress(currentAccount) : null}</span>
        <CopyIcon className={styles.smallIcon} />
      </button>
      <SuiIcon className={styles.userIcon} />
      <div className={styles.balance}>{balance.toFormat()} SUI</div>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => {
            window.open(
              `https://explorer.sui.io/address/${currentAccount}?network=${sdk._network}`
            );
          }}
          className={styles.iconButton}
        >
          <ExternalLinkIcon className={styles.icon} />
          <span>Explorer</span>
        </button>
        <button
          onClick={() => disconnect().then(() => close())}
          className={styles.iconButton}
        >
          <PowerIcon className={styles.icon} />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
}

export default Profile;
