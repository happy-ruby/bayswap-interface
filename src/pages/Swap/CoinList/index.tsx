import { useState } from 'react';

import { Currency } from '@bayswap/sdk';
import { useWalletKit } from '@mysten/wallet-kit';

import CoinIcon from 'components/CoinIcon';
import useSearch from 'hooks/useSearch';
import useUser from 'hooks/useUser';
import { roundBalanceByType } from 'utils/transform';

import styles from './style.module.css';

type Props = {
  coins: any;
  close: () => void;
  onChange: (coin: any) => void;
};

const conditions = {
  keys: ['symbol'],
};

function CoinList({ coins, close, onChange }: Props) {
  const [keyword, setKeyword] = useState('');
  const filteredCoins = useSearch(coins, keyword, conditions);
  const { balances } = useUser();
  const { isConnected } = useWalletKit();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Token</h2>
      <input
        placeholder="Search token by name"
        onChange={(e) => setKeyword(e.target.value)}
        className={styles.input}
      />
      <div className={styles.coins}>
        {filteredCoins.map((coin: Currency) => {
          const balance = roundBalanceByType(balances, coin.type);

          return (
            <button
              key={coin.type}
              onClick={() => {
                onChange(coin);
                close();
              }}
              className={styles.row}
            >
              <div className={styles.coin}>
                <CoinIcon name={coin.symbol} className={styles.coinIcon} />
                <div>
                  <div className={styles.symbol}>{coin.symbol}</div>
                  <div className={styles.name}>{coin.name}</div>
                </div>
              </div>
              <div className={styles.balance}>
                {isConnected ? balance.toFormat() : '-'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CoinList;
