import { useCallback, useEffect, useMemo, useState } from 'react';

import { CommonPoolInfo, Currency, DetailedPoolInfo } from '@bayswap/sdk';
import { useWalletKit } from '@mysten/wallet-kit';
import { FormProvider, useForm } from 'react-hook-form';

import { ReactComponent as ReverseIcon } from 'assets/images/reverse.svg';
import { ReactComponent as SettingsIcon } from 'assets/images/settings.svg';
import Dialog from 'components/Dialog';
import allPools from 'config/pools';
import useSDK from 'hooks/useSDK';
import useUser from 'hooks/useUser';
import { getPercentAmount } from 'utils/math';
import { roundBalanceByType } from 'utils/transform';

import Details from './Details';
import InputGroup from './InputGroup';
import RefreshButton from './RefreshButton';
import styles from './style.module.css';
import SubmitButton from './SubmitButton';
import SwapSetting from './SwapSetting';
import {
  calculateAmountTo,
  checkError,
  excludeCoin,
  parseAmountTo,
} from './utils';

type Form = {
  coinFrom: Currency;
  amountFrom: string;
  coinTo: Currency;
  amountTo: string;
  selectedPool: DetailedPoolInfo;
  slippage: string;
  minReceived: bigint;
  priceImpact: number;
  liquidityFee: string;
  currentPrice: string;
};

const defaultValues = {
  slippage: '0.5',
};

function Swap() {
  const [coins, setCoins] = useState<Currency[]>([]);
  const methods = useForm<Form>({ defaultValues });
  const { sdk } = useSDK();
  const { balances, reloadBalances } = useUser();
  const { isConnected } = useWalletKit();

  const { coinFrom, amountFrom, coinTo, selectedPool } = methods.watch();
  const balanceFrom = roundBalanceByType(balances, coinFrom?.type);
  const balanceTo = roundBalanceByType(balances, coinTo?.type);

  const pools: CommonPoolInfo[] = useMemo(
    () => Object.values(allPools[sdk._network]),
    [sdk._network]
  );

  const reverse = useCallback(() => {
    if (coinTo && coinFrom) {
      methods.setValue('coinFrom', coinTo);
      methods.setValue('coinTo', coinFrom);
    }
  }, [coinFrom, coinTo, methods]);

  // Get all supported coins
  useEffect(() => {
    sdk._query.getCoinsFromPools(pools).then(setCoins);
  }, [pools, sdk._query]);

  // Get selected pool info
  useEffect(() => {
    if (coinFrom && coinTo) {
      for (const pool of pools) {
        if (
          (pool.coinX == coinFrom.type && pool.coinY == coinTo.type) ||
          (pool.coinY == coinFrom.type && pool.coinX == coinTo.type)
        ) {
          sdk._query
            .getPool(pool.poolID)
            .then((info) => methods.setValue('selectedPool', info));
        }
      }
    }
  }, [coinFrom, coinTo, pools, sdk._query, methods]);

  // Estimate amount to
  useEffect(() => {
    if (selectedPool && coinFrom) {
      if (amountFrom) {
        const bigintAmount = calculateAmountTo(
          selectedPool,
          amountFrom,
          coinFrom
        );
        methods.setValue('amountTo', parseAmountTo(bigintAmount));
      } else {
        methods.setValue('amountTo', '');
      }
    }
  }, [amountFrom, coinFrom, selectedPool, methods]);

  useEffect(() => {
    if (coinFrom?.type && coinTo?.type && coinFrom.type === coinTo.type) {
      methods.setValue('coinTo', excludeCoin(coins, coinFrom)[0]);
    }
  }, [coins, coinFrom, coinTo, methods]);

  return (
    <FormProvider {...methods}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Swap</h1>
          <div className={styles.buttonGroup}>
            <RefreshButton onClick={reloadBalances} />

            <Dialog.Provider>
              <Dialog.Trigger className={styles.iconButton}>
                <SettingsIcon className={styles.icon} />
              </Dialog.Trigger>
              <Dialog.Consumer>
                {({ close }) => <SwapSetting close={close} />}
              </Dialog.Consumer>
            </Dialog.Provider>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label}>
            From
            {[25, 50, 75, 100].map((percentage) => (
              <button
                key={percentage}
                onClick={() => {
                  if (balanceFrom.isGreaterThan(0)) {
                    methods.setValue(
                      'amountFrom',
                      getPercentAmount(balanceFrom.toString(), percentage)
                    );
                  } else {
                    methods.setValue('amountFrom', '');
                  }
                }}
                className={
                  Number(amountFrom) > 0 &&
                  getPercentAmount(balanceFrom.toString(), percentage) ===
                    amountFrom
                    ? styles.percentButtonActive
                    : styles.percentButton
                }
              >
                {percentage}%
              </button>
            ))}
          </label>
          <InputGroup
            amountName="amountFrom"
            coinName="coinFrom"
            coins={coins}
          />
          <div className={styles.balance}>
            Balance: {isConnected && coinFrom ? balanceFrom.toFormat() : '-'}{' '}
            {coinFrom?.symbol}
          </div>
        </div>
        <button onClick={reverse} className={styles.reverseButton}>
          <ReverseIcon className={styles.reverseIcon} />
        </button>
        <div className={styles.inputContainer}>
          <label className={styles.label}>To (estimated)</label>
          <InputGroup
            readOnly
            amountName="amountTo"
            coinName="coinTo"
            coins={excludeCoin(coins, coinFrom)}
          />
          <div className={styles.balance}>
            Balance: {isConnected && coinTo ? balanceTo.toFormat() : '-'}{' '}
            {coinTo?.symbol}
          </div>
        </div>
        <Details />
        <SubmitButton
          errorMessage={checkError(coinFrom, coinTo, amountFrom, balanceFrom)}
        />
      </div>
    </FormProvider>
  );
}

export default Swap;
