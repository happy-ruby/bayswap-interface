import { useFormContext } from 'react-hook-form';

import styles from './style.module.css';
import { calMintedLP, calPoolShare, mulDecimals } from '../utils';

function Review() {
  const { watch } = useFormContext();
  const [amount1, amount2, pool] = watch(['amount1', 'amount2', 'pool']);

  if (pool && amount1 && amount2) {
    const amt1WithDecimals = mulDecimals(amount1);
    const amt2WithDecimals = mulDecimals(amount2);

    const shared = calPoolShare(
      pool.coinXReserve,
      pool.coinYReserve,
      amt1WithDecimals,
      amt2WithDecimals
    );

    const lp = calMintedLP(
      pool.lpTokenSupply.value,
      pool.coinXReserve,
      pool.coinYReserve,
      amt1WithDecimals,
      amt2WithDecimals
    );

    return (
      <div className={styles.card}>
        <div className={styles.row}>
          <div>Estimated pool share</div>
          <div>{`${shared.decimalPlaces(3).toString()} %`}</div>
        </div>
        <div className={styles.row}>
          <div>Estimated LP received</div>
          <div>{`${lp.toLocaleString()} LP`}</div>
        </div>
      </div>
    );
  }

  return null;
}

export default Review;
