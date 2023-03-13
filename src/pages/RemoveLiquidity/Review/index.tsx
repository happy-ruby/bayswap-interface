import { useFormContext } from 'react-hook-form';

import { getSymbol } from 'utils/transform';

import styles from './style.module.css';

function Review() {
  const { watch } = useFormContext();
  const { coin1Type, coin2Type, xReturned, yReturned } = watch();

  return (
    <div className={styles.info}>
      <div className={styles.infoRow}>
        <div>Estimated {getSymbol(coin1Type)} received</div>
        <div>{xReturned ?? 0}</div>
      </div>
      <div className={styles.infoRow}>
        <div>Estimated {getSymbol(coin2Type)} received</div>
        <div>{yReturned ?? 0}</div>
      </div>
    </div>
  );
}

export default Review;
