import { useState } from 'react';

import { SuiMoveObject, SuiObject } from '@mysten/sui.js';
import { useWalletKit } from '@mysten/wallet-kit';
import { useFormContext } from 'react-hook-form';

import SuccessContent from 'components/SuccessContent';
import { DECIMALS, Status } from 'constant';
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
  const { handleSubmit, setValue } = useFormContext();
  const { sdk } = useSDK();
  const { balances, reloadBalances } = useUser();
  const { isConnected, currentAccount, signAndExecuteTransaction } =
    useWalletKit();

  async function swap(data: any) {
    if (!isConnected || !currentAccount) return;

    if (!Object.values(data).every(Boolean)) return;

    const { coinFrom, amountFrom, selectedPool, minReceived } = data;

    if (!balances || !balances[coinFrom.type] || !selectedPool || !amountFrom)
      return;

    const amountWithDecimals = Number(amountFrom) * DECIMALS;

    const coins =
      await sdk._provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        currentAccount,
        BigInt(amountWithDecimals),
        coinFrom.type,
        []
      );

    const idXs = coins.map((c) => {
      return ((c.details as SuiObject).data as SuiMoveObject).fields.id.id;
    });

    const unsignedTx = sdk._swap.buildSwapUnsignedTx(
      {
        coinX: selectedPool.coinX,
        coinY: selectedPool.coinY,
        curve: selectedPool.curve,
      },
      {
        packageObjectId: sdk._registry.PackageID,
        poolId: selectedPool.id,
        coinID: idXs,
        amount: amountWithDecimals.toString(),
        coinOutMin: minReceived.toString(),
        coinInputType: coinFrom.type,
      }
    );

    try {
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
        setValue('amountFrom', '');
        setValue('amountTo', '');
        setValue('minReceived', '');
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
          Swap
        </button>
        <ConfirmDialog
          isOpen={isConfirming}
          close={() => setIsConfirming(false)}
          confirm={handleSubmit(swap)}
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
