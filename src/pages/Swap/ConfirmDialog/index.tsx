import { useFormContext } from 'react-hook-form';

import CoinIcon from 'components/CoinIcon';
import Dialog from 'components/Dialog';

import styles from './styles.module.css';
import Details from '../Details';

type Props = {
  isOpen: boolean;
  close: () => void;
  confirm: () => void;
};

function ConfirmDialog({ isOpen, close, confirm }: Props) {
  const { watch } = useFormContext();
  const { coinFrom, coinTo, amountFrom, amountTo } = watch();

  return (
    <Dialog.Content isOpen={isOpen} close={close}>
      <div className={styles.container}>
        <div className={styles.title}>Confirm Swap</div>
        <div className={styles.row}>
          <div className={styles.label}>From:</div>
          <div className={styles.info}>
            <span>{amountFrom}</span>
            <span>{coinFrom.symbol}</span>
            <CoinIcon name={coinFrom.symbol} className={styles.coinIcon} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>To:</div>
          <div className={styles.info}>
            <span>{amountTo}</span>
            <span>{coinTo.symbol}</span>
            <CoinIcon name={coinTo.symbol} className={styles.coinIcon} />
          </div>
        </div>
        <Details animate={false} />
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
      </div>
    </Dialog.Content>
  );
}

export default ConfirmDialog;
