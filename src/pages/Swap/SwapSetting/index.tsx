import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import styles from './style.module.css';

type Props = {
  close: () => void;
};

const quickSlippage = ['0.5', '1', '2'];

function SwapSetting({ close }: Props) {
  const { control, setValue, watch } = useFormContext();
  const slippage = watch('slippage');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Swap settings</h2>
      <p className={styles.subtitle}>Slippage Tolerance</p>
      <div className={styles.row}>
        <div className={styles.inputContainer}>
          <Controller
            control={control}
            name="slippage"
            render={({ field: { onChange, name, value } }) => (
              <NumericFormat
                autoComplete="off"
                allowNegative={false}
                name={name}
                value={value}
                onChange={onChange}
                className={styles.input}
              />
            )}
          />
          <div className={styles.unit}>%</div>
        </div>
        <div className={styles.buttonGroup}>
          {quickSlippage.map((value, index) => (
            <button
              key={index}
              onClick={() => setValue('slippage', value)}
              className={
                slippage === value
                  ? styles.quickButtonActive
                  : styles.quickButton
              }
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <button onClick={close} className={styles.submitButton}>
        Done
      </button>
    </div>
  );
}

export default SwapSetting;
