import { useFormContext } from 'react-hook-form';

import CoinIcon from 'components/CoinIcon';
import Dialog from 'components/Dialog';

import styles from './styles.module.css';
import Review from '../Review';

type Props = {
  isOpen: boolean;
  close: () => void;
  confirm: () => void;
};

function ConfirmDialog({ isOpen, close, confirm }: Props) {
  const { watch } = useFormContext();
  const { amount } = watch();

  return (
    <Dialog.Content isOpen={isOpen} close={close}>
      <div className={styles.title}>Confirm</div>
      <div className={styles.row}>
        <div className={styles.label}>Send:</div>
        <div className={styles.info}>
          <span>{amount}</span>
          <span>LP</span>
          <CoinIcon name="LP" className={styles.coinIcon} />
        </div>
      </div>
      <Review />
      <div className={styles.buttonGroup}>
        <button onClick={close} className={styles.rejectButton}>
          Reject
        </button>
        <button
          onClick={() => {
            close();
            confirm();
          }}
          className={styles.confirmButton}
        >
          Confirm
        </button>
      </div>
    </Dialog.Content>
  );
}

export default ConfirmDialog;
