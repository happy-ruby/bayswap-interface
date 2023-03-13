import { useCallback, useEffect, useState } from 'react';

import { useWalletKit } from '@mysten/wallet-kit';

import CoinIcon from 'components/CoinIcon';
import DataLoader from 'components/Loader/DataLoader';
import SuccessContent from 'components/SuccessContent';
import { DECIMALS, Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import useSDK from 'hooks/useSDK';
import useUser from 'hooks/useUser';
import { waitingTxExecuted } from 'utils/polling';
import { getExplorerLink, roundBalanceByType } from 'utils/transform';

import styles from './style.module.css';
import { Coin, sortCoins } from './utils';

const AMOUNT = 100 * DECIMALS;

function Faucet() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const setStatus = useAppStatus((state) => state.setStatus);
  const { sdk } = useSDK();
  const { balances, reloadBalances } = useUser();
  const { currentAccount, signAndExecuteTransaction } = useWalletKit();

  const claim = useCallback(
    async (coinType: string, treasuryCapObjectId: string) => {
      if (coinType.length > 0 && treasuryCapObjectId.length > 0) {
        try {
          const splits = coinType.split('::');

          const unsignedTx: any = sdk._faucet.buildFaucetCoinUnsignedTx({
            packageObjectId: sdk._registry.TestPackage,
            treasuryCapObjectId,
            module: splits[1],
            amount: String(AMOUNT),
          });

          setStatus(Status.PROCESSING);
          const { effects } = await signAndExecuteTransaction({
            kind: 'moveCall',
            data: unsignedTx,
          });

          const txDigest = effects.transactionDigest;

          await waitingTxExecuted(txDigest);

          if (JSON.stringify(effects).includes(`"status":"success"`)) {
            const link = getExplorerLink(txDigest, sdk._network);

            setStatus(Status.SUCCESS, <SuccessContent link={link} />);
            await reloadBalances();
          } else {
            setStatus(Status.ERROR);
          }
        } catch (error) {
          console.error(error);
          setStatus(Status.ERROR);
        }
      }
    },
    [reloadBalances, sdk, signAndExecuteTransaction, setStatus]
  );

  useEffect(() => {
    if (currentAccount) {
      setIsLoading(true);
      sdk._query
        .getAllTestTokens()
        .then((value) => setCoins(sortCoins(value)))
        .finally(() => setIsLoading(false));
    }
  }, [currentAccount, sdk, setStatus]);

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
      <div className={styles.center}>
        <button
          onClick={() => setStatus(Status.CONNECTING)}
          className={styles.submitButton}
        >
          Connect to wallet
        </button>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {coins.map(({ coinSymbol, coinType, treasuryCapID }) => {
        const balance = roundBalanceByType(balances, coinType);

        return (
          <div key={coinType} className={styles.row}>
            <div className={styles.coin}>
              <CoinIcon name={coinSymbol} className={styles.icon} />
              <div>
                <div className={styles.symbol}>{coinSymbol}</div>
                <div className={styles.balance}>
                  Balance: {balance.toFormat()}
                </div>
              </div>
            </div>
            <button
              onClick={() => claim(coinType, treasuryCapID)}
              className={styles.submitButton}
            >
              Claim
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Faucet;
