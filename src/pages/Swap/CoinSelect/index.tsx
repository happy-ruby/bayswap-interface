import { Currency } from '@bayswap/sdk';

import { ReactComponent as ChevronDownIcon } from 'assets/images/chevron-down.svg';
import CoinIcon from 'components/CoinIcon';
import Dialog from 'components/Dialog';

import styles from './style.module.css';
import CoinList from '../CoinList';

type Props = {
  placeholder?: string;
  value: any;
  options: Currency[];
  onChange: () => void;
};

function CoinSelect({
  placeholder = 'Select token',
  value,
  options,
  onChange,
}: Props) {
  return (
    <Dialog.Provider>
      <Dialog.Trigger className={styles.coinSelect}>
        {value ? (
          <div className={styles.coin}>
            <CoinIcon name={value.symbol} className={styles.coinIcon} />
            <span>{value.symbol}</span>
          </div>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <ChevronDownIcon className={styles.icon} />
      </Dialog.Trigger>
      <Dialog.Consumer>
        {({ close }) => (
          <CoinList coins={options} close={close} onChange={onChange} />
        )}
      </Dialog.Consumer>
    </Dialog.Provider>
  );
}

export default CoinSelect;
