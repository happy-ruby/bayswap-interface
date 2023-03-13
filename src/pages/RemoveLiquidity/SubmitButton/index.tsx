import { useState } from 'react';

import { getTypeFromSupply } from '@bayswap/sdk';
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

type Props = {
  errorMessage: string | null;
};

function SubmitButton({ errorMessage }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const setStatus = useAppStatus((state) => state.setStatus);
  const { sdk } = useSDK();
  const { handleSubmit, setValue } = useFormContext();
  const { reloadBalances } = useUser();
  const { isConnected, currentAccount, signAndExecuteTransaction } =
    useWalletKit();

  async function removeLiquidity(data: any) {
    if (!currentAccount) return;

    const { amount, pool } = data;

    const lpType = getTypeFromSupply(pool.lpTokenSupply.type);

    const lpCoins =
      await sdk._provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        currentAccount,
        BigInt(amount),
        lpType,
        []
      );

    const ids: string[] = lpCoins.map((c) => {
      return ((c.details as SuiObject).data as SuiMoveObject).fields.id.id;
    });

    const unsignTx = sdk._liquidity.buildUnsignedTxRemoveLiquidity(
      {
        packageObjectId: sdk._registry.PackageID,
        coinX: pool.coinX,
        coinY: pool.coinY,
        curve: pool.curve,
      },
      {
        poolID: pool.id,
        lpCoins: ids,
        burntAmt: amount,
        minXOut: '0',
        minYOut: '0',
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
        setValue('amount', '');
        setValue('xReturned', null);
        setValue('yReturned', null);
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
          Remove liquidity
        </button>
        <ConfirmDialog
          isOpen={isConfirming}
          close={() => setIsConfirming(false)}
          confirm={handleSubmit(removeLiquidity)}
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
