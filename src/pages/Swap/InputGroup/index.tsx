import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import styles from './style.module.css';
import CoinSelect from '../CoinSelect';

type Props = {
  amountName: string;
  coinName: string;
  coins: any;
  readOnly?: boolean;
};

function InputGroup({ amountName, coinName, coins, readOnly = false }: Props) {
  const { control } = useFormContext();

  return (
    <div className={styles.inputGroup}>
      <Controller
        control={control}
        name={amountName}
        render={({ field: { onChange, name, value } }) => (
          <NumericFormat
            readOnly={readOnly}
            placeholder="0.0"
            autoComplete="off"
            allowNegative={false}
            name={name}
            value={value}
            onChange={onChange}
            className={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name={coinName}
        render={({ field: { onChange, value } }) => (
          <CoinSelect value={value} options={coins} onChange={onChange} />
        )}
      />
    </div>
  );
}

export default InputGroup;
