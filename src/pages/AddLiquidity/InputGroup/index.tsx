import { useCallback } from 'react';

import { convertWithCurrentPrice } from '@bayswap/sdk';
import BigNumber from 'bignumber.js';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { getPercentAmount } from 'utils/math';
import { getSymbol } from 'utils/transform';

import styles from './style.module.css';
import { divDecimals, isFirstAddLiquid, mulDecimals } from '../utils';

type Props = {
  baseCoinType: string;
  baseAmount: string;
  dependedAmount: string;
  balance: BigNumber;
};

function InputGroup({
  baseCoinType,
  baseAmount,
  dependedAmount,
  balance,
}: Props) {
  const { control, setValue, watch } = useFormContext();
  const [coinType, amount, pool] = watch([baseCoinType, baseAmount, 'pool']);

  const changeValue = useCallback(
    (value: string) => {
      setValue(baseAmount, value);

      if (Number(value) > 0) {
        if (isFirstAddLiquid(pool)) return;

        const newAmount = convertWithCurrentPrice(
          mulDecimals(value),
          pool.coinXReserve,
          pool.coinYReserve
        );

        setValue(dependedAmount, divDecimals(newAmount.toString()).toString());
      } else {
        setValue(dependedAmount, '');
      }
    },
    [baseAmount, dependedAmount, pool, setValue]
  );

  return (
    <div className={styles.inputGroup}>
      <div className={styles.label}>
        Deposit {getSymbol(coinType)}
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
        name={baseAmount}
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
      <div className={styles.value}>
        Balance: {balance.toFormat()} {getSymbol(coinType)}
      </div>
    </div>
  );
}

export default InputGroup;
