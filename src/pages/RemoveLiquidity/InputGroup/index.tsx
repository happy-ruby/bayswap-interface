import { useCallback } from 'react';

import { calReturnedCoinsAfterBurnt } from '@bayswap/sdk';
import BigNumber from 'bignumber.js';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { roundBalance } from 'utils/transform';

import styles from './style.module.css';
import { getPercentAmount } from '../utils';

type Props = {
  balance: BigNumber;
};

function InputGroup({ balance }: Props) {
  const { control, setValue, watch } = useFormContext();
  const [amount, pool] = watch(['amount', 'pool']);

  const changeValue = useCallback(
    (value: string) => {
      setValue('amount', value);

      if (pool) {
        const [x, y] = calReturnedCoinsAfterBurnt(
          pool.coinXReserve,
          pool.coinYReserve,
          pool.lpTokenSupply.value,
          BigInt(value)
        );

        setValue('xReturned', roundBalance(x).toFormat());
        setValue('yReturned', roundBalance(y).toFormat());
      }
    },
    [pool, setValue]
  );

  return (
    <div className={styles.inputGroup}>
      <div className={styles.label}>
        Withdraw LP
        {[25, 50, 100].map((percentage) => (
          <button
            key={percentage}
            onClick={() =>
              changeValue(getPercentAmount(balance.toString(), percentage))
            }
            className={
              Number(amount) > 0 &&
              getPercentAmount(balance.toString(), percentage) === amount
                ? styles.percentButtonActive
                : styles.percentButton
            }
          >
            {percentage}%
          </button>
        ))}
      </div>
      <Controller
        control={control}
        name="amount"
        render={({ field: { name, value } }) => (
          <NumericFormat
            placeholder="0.0"
            autoComplete="off"
            allowNegative={false}
            name={name}
            value={value}
            onValueChange={({ value }) => changeValue(value)}
            className={styles.input}
          />
        )}
      />
      <div className={styles.value}>Balance: {balance.toFormat()} LP</div>
    </div>
  );
}

export default InputGroup;
