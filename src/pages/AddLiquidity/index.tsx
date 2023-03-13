import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DetailedPoolInfo } from '@bayswap/sdk';
import { FormProvider, useForm } from 'react-hook-form';

import { ReactComponent as ChevronLeftIcon } from 'assets/images/chevron-left.svg';
import { ReactComponent as PlusIcon } from 'assets/images/plus.svg';
import CoinIcon from 'components/CoinIcon';
import { Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import useSDK from 'hooks/useSDK';
import useUser from 'hooks/useUser';
import { getSymbol, roundBalance, roundBalanceByType } from 'utils/transform';

import InputGroup from './InputGroup';
import Review from './Review';
import styles from './style.module.css';
import SubmitButton from './SubmitButton';
import { checkError } from './utils';

const poolInfo = [
  { name: 'Total liquidity', value: '$ 2,319,283,179' },
  { name: '24H volume', value: '$ 982,871,311' },
  { name: '7D volume', value: '$ 1,223,999,763' },
];

type Form = {
  coin1Type: string;
  coin2Type: string;
  amount1: string;
  amount2: string;
  pool: DetailedPoolInfo;
};

function AddLiquidity() {
  const navigate = useNavigate();
  const { poolID } = useParams();
  const setStatus = useAppStatus((state) => state.setStatus);
  const { balances, reloadBalances } = useUser();
  const { sdk } = useSDK();
  const formProps = useForm<Form>();
  const { setValue, watch } = formProps;
  const { coin1Type, coin2Type, amount1, amount2, pool } = watch();
  const balance1 = roundBalanceByType(balances, coin1Type, 0);
  const balance2 = roundBalanceByType(balances, coin2Type, 0);

  const reloadPool = useCallback(async () => {
    if (poolID) {
      try {
        const pool = await sdk._query.getPool(poolID);
        setValue('coin1Type', pool.coinX);
        setValue('coin2Type', pool.coinY);
        setValue('pool', pool);
      } catch (error) {
        console.error(error);
      }
    }
  }, [poolID, sdk._query, setValue]);

  useEffect(() => {
    reloadBalances();
  }, [reloadBalances]);

  useEffect(() => {
    setStatus(Status.LOADING);
    reloadPool().finally(() => setStatus(Status.IDLE));
  }, [reloadPool, setStatus]);

  if (!pool) return null;

  return (
    <FormProvider {...formProps}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ChevronLeftIcon className={styles.backIcon} />
          </button>
          <div className={styles.icons}>
            <CoinIcon name={getSymbol(coin1Type)} className={styles.coinX} />
            <CoinIcon name={getSymbol(coin2Type)} className={styles.coinY} />
          </div>
          <span>
            {getSymbol(coin1Type)} - {getSymbol(coin2Type)}
          </span>
        </div>
        <div className={styles.body}>
          <div className={styles.info}>
            {poolInfo.map(({ name, value }, index) => (
              <div key={index} className={styles.infoRow}>
                <div>{name}</div>
                <div>{value}</div>
              </div>
            ))}
            <div className={styles.infoRow}>
              <div>Coin {getSymbol(coin1Type)} reserve</div>
              <div>{roundBalance(pool.coinXReserve).toFormat()}</div>
            </div>
            <div className={styles.infoRow}>
              <div>Coin {getSymbol(coin2Type)} reserve</div>
              <div>{roundBalance(pool.coinYReserve).toFormat()}</div>
            </div>
          </div>
          <div className={styles.form}>
            <InputGroup
              baseCoinType="coin1Type"
              baseAmount="amount1"
              dependedAmount="amount2"
              balance={balance1}
            />
            <PlusIcon className={styles.plusIcon} />
            <InputGroup
              baseCoinType="coin2Type"
              baseAmount="amount2"
              dependedAmount="amount1"
              balance={balance2}
            />
          </div>
          <Review />
          <SubmitButton
            errorMessage={checkError(amount1, amount2, balance1, balance2)}
            reloadPool={reloadPool}
          />
        </div>
      </div>
    </FormProvider>
  );
}

export default AddLiquidity;
