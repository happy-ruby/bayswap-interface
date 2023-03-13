import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { DetailedPoolInfo, getTypeFromSupply } from '@bayswap/sdk';
import { useWalletKit } from '@mysten/wallet-kit';

import CoinIcon from 'components/CoinIcon';
import DataLoader from 'components/Loader/DataLoader';
import Pagination from 'components/Pagination';
import { Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import usePagination from 'hooks/usePagination';
import useSDK from 'hooks/useSDK';
import useUser from 'hooks/useUser';
import { getSymbol } from 'utils/transform';

import styles from './style.module.css';
import { calCurrentPoolShare } from '../utils';

type Props = {
  pools: DetailedPoolInfo[];
  visible: boolean;
  isLoading: boolean;
};

function OwnedPools({ pools, visible, isLoading }: Props) {
  const [ownedPools, setOwnedPools] = useState<DetailedPoolInfo[]>([]);
  const setStatus = useAppStatus((state) => state.setStatus);
  const { rows, pages, page, setPage } =
    usePagination<DetailedPoolInfo>(ownedPools);
  const { balances, reloadBalances } = useUser();
  const { sdk } = useSDK();
  const { currentAccount } = useWalletKit();

  useEffect(() => {
    if (visible) {
      reloadBalances();
    }
  }, [visible, reloadBalances]);

  useEffect(() => {
    if (!currentAccount || !balances) return;

    const ownedPools = pools.reduce<DetailedPoolInfo[]>((result, pool) => {
      const lpType = getTypeFromSupply(pool.lpTokenSupply.type);
      if (balances[lpType] && balances[lpType].balance > 0) {
        return [...result, pool];
      }

      return result;
    }, []);

    setOwnedPools(ownedPools);
  }, [pools, currentAccount, sdk, balances]);

  if (!visible) return null;

  if (isLoading) {
    return (
      <div className={styles.center}>
        <DataLoader />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={styles.center}>
        <div>No data found</div>
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className={styles.center}>
        <button
          onClick={() => setStatus(Status.CONNECTING)}
          className={styles.connectButton}
        >
          Connect to wallet
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          {['POOL', 'POOL SHARED'].map((title, index) => (
            <div key={index}>{title}</div>
          ))}
        </div>
        {rows.map((pool) => (
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
                    {pool.curve.includes('Uncorrelated')
                      ? ''
                      : ' (Stable Pool)'}
                  </div>
                </div>
              </div>
              <div className={styles.poolInfoMobile}>
                <span>Pool shared:</span>
                <div>
                  {balances ? calCurrentPoolShare(pool, balances) : null}%
                </div>
              </div>
            </div>
            <div className={styles.poolInfoDesktop}>
              {balances ? calCurrentPoolShare(pool, balances) : null}%
            </div>
            <div className={styles.buttonGroup}>
              <NavLink
                to={`/add-liquidity/${pool.id}`}
                className={styles.buttonLink}
              >
                Add liquidity
              </NavLink>
              <NavLink
                to={`/remove-liquidity/${pool.id}`}
                className={styles.buttonLink}
              >
                Remove liquidity
              </NavLink>
            </div>
          </div>
        ))}
      </div>
      <Pagination pages={pages} page={page} setPage={setPage} />
    </>
  );
}

export default OwnedPools;
