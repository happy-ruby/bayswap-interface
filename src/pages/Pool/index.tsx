import { useEffect, useState } from 'react';

import { DetailedPoolInfo } from '@bayswap/sdk';

import allPools from 'config/pools';
import useSDK from 'hooks/useSDK';

import AllPools from './AllPools';
import OwnedPools from './OwnedPools';
import styles from './style.module.css';

enum Tab {
  Pools,
  OwnedPools,
}

const poolInfo = [
  { name: 'TOTAL LIQUIDITY', value: '$ 17,850,776.95' },
  { name: '1W VOLUME', value: '$ 3,998,030.44' },
  { name: '1W TRANSACTIONS', value: '15,710' },
];

function Pool() {
  const [pools, setPools] = useState<DetailedPoolInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Pools);
  const { sdk } = useSDK();

  useEffect(() => {
    const ids = Object.keys(allPools[sdk._network]);
    setIsLoading(true);
    sdk._query
      .getPoolBatch(ids)
      .then(setPools)
      .finally(() => setIsLoading(false));
  }, [sdk._network, sdk._query]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {poolInfo.map(({ name, value }, index) => (
          <div key={index} className={styles.col}>
            <div className={styles.label}>{name}</div>
            <div className={styles.value}>{value}</div>
          </div>
        ))}
      </div>
      <div className={styles.tabs}>
        <div className={styles.tabHeader}>
          {['Pools', 'My Pools'].map((name, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={activeTab === index ? styles.activeTab : styles.tab}
            >
              {name}
            </button>
          ))}
        </div>
        <AllPools
          pools={pools}
          visible={activeTab === Tab.Pools}
          isLoading={isLoading}
        />
        <OwnedPools
          pools={pools}
          visible={activeTab === Tab.OwnedPools}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Pool;
