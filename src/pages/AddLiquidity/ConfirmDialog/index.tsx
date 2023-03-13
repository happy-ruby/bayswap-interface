import { useFormContext } from 'react-hook-form';

import CoinIcon from 'components/CoinIcon';
import Dialog from 'components/Dialog';
import { getSymbol } from 'utils/transform';

import styles from './styles.module.css';
import Review from '../Review';

type Props = {
  isOpen: boolean;
  close: () => void;
  confirm: () => void;
};

function ConfirmDialog({ isOpen, close, confirm }: Props) {
  const { watch } = useFormContext();
  const { coin1Type, coin2Type, amount1, amount2 } = watch();

  return (
    <Dialog.Content isOpen={isOpen} close={close}>
      <div className={styles.title}>Confirm</div>
      <div className={styles.row}>
        <div className={styles.label}>Send:</div>
        <div>
          <div className={styles.info}>
            <span>{amount1}</span>
            <span>{getSymbol(coin1Type)}</span>
            <CoinIcon name={getSymbol(coin1Type)} className={styles.coinIcon} />
          </div>
          <div className={styles.info}>
            <span>{amount2}</span>
            <span>{getSymbol(coin2Type)}</span>
            <CoinIcon name={getSymbol(coin2Type)} className={styles.coinIcon} />
          </div>
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
