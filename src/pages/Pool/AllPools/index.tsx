import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { DetailedPoolInfo } from '@bayswap/sdk';

import CoinIcon from 'components/CoinIcon';
import DataLoader from 'components/Loader/DataLoader';
import useUser from 'hooks/useUser';
import { getSymbol } from 'utils/transform';

import styles from './style.module.css';
import { getTotalFee, getTotalLiquid } from '../utils';

type Props = {
  pools: DetailedPoolInfo[];
  visible: boolean;
  isLoading: boolean;
};

function AllPools({ pools, visible, isLoading }: Props) {
  const { reloadBalances } = useUser();

  useEffect(() => {
    if (visible) {
      reloadBalances();
    }
  }, [visible, reloadBalances]);

  if (!visible) return null;

  if (isLoading) {
    return (
      <div className={styles.center}>
        <DataLoader />
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className={styles.center}>
        <div>No data found</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {['POOL', 'TOTAL LIQUIDITY', 'TOTAL FEE', 'PASSIVE INCOME'].map(
          (title, index) => (
            <div key={index}>{title}</div>
          )
        )}
      </div>
      {pools.map((pool) => (
        <div key={pool.id} className={styles.row}>
          <div>
            <div className={styles.pool}>
              <div>
                <CoinIcon
                  name={getSymbol(pool.coinX)}
                  className={styles.coinX}
                />
                <CoinIcon
                  name={getSymbol(pool.coinY)}
                  className={styles.coinY}
                />
              </div>
              <div className={styles.poolName}>
                <div>{pool.name}</div>
                <div className={styles.poolType}>
                  {pool.curve.includes('Uncorrelated') ? '' : ' (Stable Pool)'}
                </div>
              </div>
            </div>
            <div className={styles.poolInfoMobile}>
              <span>Total liquidity:</span>
              <div>$ {getTotalLiquid(pool).toFormat()}</div>
            </div>
            <div className={styles.poolInfoMobile}>
              <span>Total fee:</span>
              <div>$ {getTotalFee(pool).toFormat()}</div>
            </div>
          </div>

          <div className={styles.poolInfoDesktop}>
            $ {getTotalLiquid(pool).toFormat()}
          </div>
          <div className={styles.poolInfoDesktop}>
            $ {getTotalFee(pool).toFormat()}
          </div>
          <div className={styles.buttonGroup}>
            <NavLink
              to={`/add-liquidity/${pool.id}`}
              className={styles.buttonLink}
            >
              Add liquidity
            </NavLink>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllPools;
