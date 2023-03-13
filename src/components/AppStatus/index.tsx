import { ReactComponent as ErrorIcon } from 'assets/images/error.svg';
import { ReactComponent as SuccessIcon } from 'assets/images/success.svg';
import Dialog from 'components/Dialog';
import PageLoader from 'components/Loader/PageLoader';
import ProcessLoader from 'components/Loader/ProcessLoader';
import { Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';

import styles from './style.module.css';
import WalletList from './WalletList';

function AppStatus() {
  const { status, content, setStatus } = useAppStatus();

  return (
    <>
      <Dialog.Content
        isOpen={status === Status.ERROR}
        close={() => setStatus(Status.IDLE, null)}
      >
        <div className={styles.body}>
          <ErrorIcon className={styles.icon} />
          <div className={styles.errorTitle}>Oops, something went wrong!</div>
          {content}
          <button
            onClick={() => setStatus(Status.IDLE, null)}
            className={styles.errorButton}
          >
            Try again
          </button>
        </div>
      </Dialog.Content>

      <Dialog.Content
        isOpen={status === Status.SUCCESS}
        close={() => setStatus(Status.IDLE, null)}
      >
        <div className={styles.body}>
          <SuccessIcon className={styles.icon} />
          <div className={styles.successTitle}>Success</div>
          {content}
          <button
            onClick={() => setStatus(Status.IDLE, null)}
            className={styles.successButton}
          >
            Continue
          </button>
        </div>
      </Dialog.Content>

      <Dialog.Content
        isOpen={status === Status.CONNECTING}
        close={() => setStatus(Status.IDLE, null)}
      >
        <WalletList close={() => setStatus(Status.IDLE, null)} />
      </Dialog.Content>

      <Dialog.Content isOpen={status === Status.PROCESSING}>
        <div className={styles.center}>
          <ProcessLoader />
          <div className={styles.processTitle}>Waiting for Confirmation</div>
        </div>
      </Dialog.Content>

      <PageLoader visible={status === Status.LOADING} />
    </>
  );
}

export default AppStatus;
