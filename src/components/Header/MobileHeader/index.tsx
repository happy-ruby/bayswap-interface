import { useWalletKit } from '@mysten/wallet-kit';

import { ReactComponent as Logo } from 'assets/images/logo.svg';
import { ReactComponent as MenuIcon } from 'assets/images/menu.svg';
import { ReactComponent as SettingsIcon } from 'assets/images/settings.svg';
import { ReactComponent as UserIcon } from 'assets/images/user.svg';
import Dialog from 'components/Dialog';
import Sidebar from 'components/Sidebar';
import { SUI, Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import useUser from 'hooks/useUser';
import { roundBalanceByType } from 'utils/transform';

import styles from './style.module.css';
import Nav from '../Nav';
import Profile from '../Profile';
import Setting from '../Setting';

function MobileHeader() {
  const setStatus = useAppStatus((state) => state.setStatus);
  const { currentAccount, isConnected } = useWalletKit();
  const { balances } = useUser();
  const balance = roundBalanceByType(balances, SUI);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo className={styles.logo} />
      </div>
      <div className={styles.right}>
        <div className={styles.network}>DEVNET</div>
        {isConnected && currentAccount ? (
          <>
            <div className={styles.balance}>{balance.toFormat()} SUI</div>
            <Sidebar.Provider>
              <Sidebar.Trigger className={styles.iconButton}>
                <UserIcon className={styles.icon} />
              </Sidebar.Trigger>
              <Sidebar.Consumer>
                {({ close }) => <Profile close={close} />}
              </Sidebar.Consumer>
            </Sidebar.Provider>
          </>
        ) : (
          <button
            onClick={() => setStatus(Status.CONNECTING)}
            className={styles.connectButton}
          >
            Connect
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
        <Sidebar.Provider>
          <Sidebar.Trigger className={styles.iconButton}>
            <MenuIcon className={styles.icon} />
          </Sidebar.Trigger>
          <Sidebar.Consumer>
            {({ close }) => <Nav close={close} />}
          </Sidebar.Consumer>
        </Sidebar.Provider>
      </div>
    </header>
  );
}

export default MobileHeader;
