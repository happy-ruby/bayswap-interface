import { useState } from 'react';

import { SuiMoveObject, SuiObject } from '@mysten/sui.js';
import { useWalletKit } from '@mysten/wallet-kit';
import { useFormContext } from 'react-hook-form';

import SuccessContent from 'components/SuccessContent';
import { Status } from 'constant';
import useAppStatus from 'hooks/useAppStatus';
import useSDK from 'hooks/useSDK';
import useUser from 'hooks/useUser';
import { waitingTxExecuted } from 'utils/polling';
import { getExplorerLink } from 'utils/transform';

import styles from './style.module.css';
import ConfirmDialog from '../ConfirmDialog';
import { mulDecimals } from '../utils';

type Props = {
  errorMessage: string | null;
  reloadPool: () => Promise<void>;
};

function SubmitButton({ errorMessage, reloadPool }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const setStatus = useAppStatus((state) => state.setStatus);
  const { sdk } = useSDK();
  const { handleSubmit, setValue } = useFormContext();
  const { reloadBalances } = useUser();
  const { isConnected, currentAccount, signAndExecuteTransaction } =
    useWalletKit();

  async function addLiquidity(data: any) {
    if (!currentAccount) return;

    const { coin1Type, coin2Type, amount1, amount2, pool } = data;

    const amt1WithDecimals = mulDecimals(amount1);
    const amt2WithDecimals = mulDecimals(amount2);

    const coinsX =
      await sdk._provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        currentAccount,
        amt1WithDecimals,
        coin1Type,
        []
      );

    const idXs = coinsX.map((c) => {
      return ((c.details as SuiObject).data as SuiMoveObject).fields.id.id;
    });

    const coinsY =
      await sdk._provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        currentAccount,
        amt2WithDecimals,
        coin2Type,
        []
      );

    const idYs = coinsY.map((c) => {
      return ((c.details as SuiObject).data as SuiMoveObject).fields.id.id;
    });

    const unsignTx = sdk._liquidity.buildAddLiquidityUnsignedTx(
      {
        packageObjectId: sdk._registry.PackageID,
        coinX: pool.coinX,
        coinY: pool.coinY,
        curve: pool.curve,
      },
      {
        poolId: pool.id,
        coinX: idXs,
        amtX: amt1WithDecimals.toString(),
        minX: '0',
        coinY: idYs,
        amtY: amt2WithDecimals.toString(),
        minY: '0',
      }
    );

    try {
      setStatus(Status.PROCESSING);
      const { effects } = await signAndExecuteTransaction({
        kind: 'moveCall',
        data: unsignTx,
      });

      const txDigest = effects.transactionDigest;

      await waitingTxExecuted(txDigest);

      if (JSON.stringify(effects).includes(`"status":"success"`)) {
        const link = getExplorerLink(txDigest, sdk._network);

        setStatus(Status.SUCCESS, <SuccessContent link={link} />);
        await reloadBalances();
        await reloadPool();
        setValue('amount1', '');
        setValue('amount2', '');
      } else {
        setStatus(Status.ERROR);
      }
    } catch (error) {
      console.error(error);
      setStatus(Status.ERROR);
    }
  }

  if (isConnected && currentAccount) {
    if (errorMessage) {
      return (
        <button disabled className={styles.submitButton}>
          {errorMessage}
        </button>
      );
    }

    return (
      <>
        <button
          onClick={() => setIsConfirming(true)}
          className={styles.submitButton}
        >
          Add liquidity
        </button>
        <ConfirmDialog
          isOpen={isConfirming}
          close={() => setIsConfirming(false)}
          confirm={handleSubmit(addLiquidity)}
        />
      </>
    );
  }

  return (
    <button
      onClick={() => setStatus(Status.CONNECTING)}
      className={styles.submitButton}
    >
      Connect to wallet
    </button>
  );
}

export default SubmitButton;
