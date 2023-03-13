import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DetailedPoolInfo, getTypeFromSupply } from '@bayswap/sdk';
import BigNumber from 'bignumber.js';
import { FormProvider, useForm } from 'react-hook-form';

import { ReactComponent as ChevronLeftIcon } from 'assets/images/chevron-left.svg';
import CoinIcon from 'components/CoinIcon';
import { Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import useSDK from 'hooks/useSDK';
import useUser from 'hooks/useUser';
import { getSymbol } from 'utils/transform';

import InputGroup from './InputGroup';
import Review from './Review';
import styles from './style.module.css';
import SubmitButton from './SubmitButton';
import { checkError } from './utils';

type Form = {
  coin1Type: string;
  coin2Type: string;
  lpType: string;
  amount: string;
  xReturned: string;
  yReturned: string;
  pool: DetailedPoolInfo;
};

function RemoveLiquidity() {
  const navigate = useNavigate();
  const { poolID } = useParams();
  const setStatus = useAppStatus((state) => state.setStatus);
  const { sdk } = useSDK();
  const { balances, reloadBalances } = useUser();
  const methods = useForm<Form>();
  const { setValue, watch } = methods;
  const { coin1Type, coin2Type, amount, pool } = watch();

  const balance = useMemo(() => {
    let lpType: any;

    if (balances && pool?.lpTokenSupply?.type) {
      lpType = getTypeFromSupply(pool.lpTokenSupply.type);
      return BigNumber(balances[lpType].balance.toString());
    }

    return BigNumber(0);
  }, [balances, pool]);

  useEffect(() => {
    reloadBalances();
  }, [reloadBalances]);

  useEffect(() => {
    if (poolID) {
      setStatus(Status.LOADING);
      sdk._query
        .getPool(poolID)
        .then((pool) => {
          setValue('coin1Type', pool.coinX);
          setValue('coin2Type', pool.coinY);
          setValue('pool', pool);
        })
        .catch((error) => console.error(error))
        .finally(() => setStatus(Status.IDLE));
    }
  }, [poolID, sdk._query, setStatus, setValue]);

  if (!pool) return null;

  return (
    <FormProvider {...methods}>
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
          <div className={styles.title}>Overview</div>
          <Review />
          <InputGroup balance={balance} />
          <SubmitButton errorMessage={checkError(amount, balance)} />
        </div>
      </div>
    </FormProvider>
  );
}

export default RemoveLiquidity;
