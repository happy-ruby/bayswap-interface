import { useWalletKit } from '@mysten/wallet-kit';

import { ReactComponent as Logo } from 'assets/images/logo.svg';
import { ReactComponent as SettingsIcon } from 'assets/images/settings.svg';
import { ReactComponent as UserIcon } from 'assets/images/user.svg';
import Dialog from 'components/Dialog';
import Dropdown from 'components/Dropdown';
import { SUI, Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import useUser from 'hooks/useUser';
import { roundBalanceByType, shortenAddress } from 'utils/transform';

import styles from './style.module.css';
import Nav from '../Nav';
import Profile from '../Profile';
import Setting from '../Setting';

function DesktopHeader() {
  const setStatus = useAppStatus((state) => state.setStatus);
  const { currentAccount, isConnected } = useWalletKit();
  const { balances } = useUser();
  const balance = roundBalanceByType(balances, SUI);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo className={styles.logo} />
        <Nav className={styles.nav} />
      </div>
      <div className={styles.right}>
        <div className={styles.network}>DEVNET</div>
        {isConnected && currentAccount ? (
          <>
            <div className={styles.balance}>{balance.toFormat()} SUI</div>
            <Dropdown.Provider>
              <Dropdown.Trigger className={styles.profileButton}>
                <UserIcon className={styles.smallIcon} />
                <span>
                  {currentAccount ? shortenAddress(currentAccount) : null}
                </span>
              </Dropdown.Trigger>
              <Dropdown.Consumer>
                {({ close }) => <Profile close={close} />}
              </Dropdown.Consumer>
            </Dropdown.Provider>
          </>
        ) : (
          <button
            onClick={() => setStatus(Status.CONNECTING)}
            className={styles.connectButton}
          >
            Connect to wallet
          </button>
        )}
        <Dialog.Provider>
          <Dialog.Trigger className={styles.iconButton}>
            <SettingsIcon className={styles.icon} />
          </Dialog.Trigger>
          <Dialog.Consumer>
            <Setting />
          </Dialog.Consumer>
        </Dialog.Provider>
      </div>
    </header>
  );
}

export default DesktopHeader;
