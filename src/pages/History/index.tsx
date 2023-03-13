import { useEffect, useState } from 'react';

import { useWalletKit } from '@mysten/wallet-kit';
import BigNumber from 'bignumber.js';

import { ReactComponent as LinkIcon } from 'assets/images/external-link.svg';
import CoinIcon from 'components/CoinIcon';
import DataLoader from 'components/Loader/DataLoader';
import Pagination from 'components/Pagination';
import { Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import usePagination from 'hooks/usePagination';
import useSDK from 'hooks/useSDK';
import {
  BaySwapTransactionsResponse,
  getBaySwapTransactions,
} from 'utils/transaction';
import { roundBalance, shortenAddress } from 'utils/transform';

import styles from './style.module.css';

function History() {
  const [txs, setTXs] = useState<BaySwapTransactionsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setStatus = useAppStatus((state) => state.setStatus);
  const { rows, pages, page, setPage } = usePagination(txs);
  const { sdk } = useSDK();
  const { currentAccount } = useWalletKit();

  useEffect(() => {
    if (currentAccount) {
      setIsLoading(true);
      getBaySwapTransactions(sdk, currentAccount)
        .then(setTXs)
        .finally(() => setIsLoading(false));
    }
  }, [currentAccount, sdk]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.center}>
          <DataLoader />
        </div>
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className={styles.container}>
        <div className={styles.center}>
          <button
            onClick={() => setStatus(Status.CONNECTING)}
            className={styles.connectButton}
          >
            Connect to wallet
          </button>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.center}>
          <div>No data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          {['TRANSACTION ID', 'TYPE', 'SEND', 'RECEIVE', 'TIME'].map(
            (title, index) => (
              <div key={index}>{title}</div>
            )
          )}
        </div>
        {rows.map(({ txId, type, coinSend, coinReceive, time }) => (
          <div key={txId} className={styles.row}>
            <div className={styles.cell}>
              <span className={styles.title}>Transaction ID:</span>
              <a
                href={`https://explorer.sui.io/transaction/${txId}?network=${sdk._network}`}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                <span>{shortenAddress(txId)}</span>
                <LinkIcon className={styles.linkIcon} />
              </a>
            </div>
            <div className={styles.cell}>
              <span className={styles.title}>Type:</span>
              <span>{type}</span>
            </div>
            <div className={styles.cell}>
              <span className={styles.title}>Send:</span>
              <div className={styles.coins}>
                {coinSend.map(({ amount, symbol }) => {
                  const balance =
                    symbol === 'LP'
                      ? BigNumber(amount)
                      : roundBalance(BigInt(amount));

                  return (
                    <div key={symbol} className={styles.coin}>
                      <CoinIcon name={symbol} className={styles.icon} />
                      <span>{balance.toFormat()}</span>
                      <span>{symbol}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.cell}>
              <span className={styles.title}>Receive:</span>
              <div className={styles.coins}>
                {coinReceive.map(({ amount, symbol }) => {
                  const balance =
                    symbol === 'LP'
                      ? BigNumber(amount)
                      : roundBalance(BigInt(amount));

                  return (
                    <div key={symbol} className={styles.coin}>
                      <CoinIcon name={symbol} className={styles.icon} />
                      <span>{balance.toFormat()}</span>
                      <span>{symbol}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.cell}>
              <span className={styles.title}>Time:</span>
              <span>{time}</span>
            </div>
          </div>
        ))}
      </div>
      <Pagination pages={pages} page={page} setPage={setPage} />
    </div>
  );
}

export default History;
