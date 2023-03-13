import { useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { ReactComponent as RepeatIcon } from 'assets/images/repeat.svg';

import styles from './style.module.css';
import { buildRate } from '../utils';

function PriceRate() {
  const [reverseRate, setReverseRate] = useState(false);
  const { watch } = useFormContext();
  const selectedPool = watch('selectedPool');

  return (
    <div className={styles.price}>
      <div>{buildRate(selectedPool, reverseRate)}</div>
      <button
        onClick={() => setReverseRate(!reverseRate)}
        className={styles.iconButton}
      >
        <RepeatIcon className={styles.icon} />
      </button>
    </div>
  );
}

export default PriceRate;
