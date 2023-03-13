import { SDK } from '@bayswap/sdk';
import {
  SuiAddress,
  SuiEvent,
  SuiTransactionResponse,
  getEvents,
  getMoveCallTransaction,
  getTransactionDigest,
  getTransactions,
} from '@mysten/sui.js';
import formatDistance from 'date-fns/formatDistance';

import { getSymbol } from 'utils/transform';

const types = {
  register_pool: 'Register Pool',
  add_liquidity: 'Add Liquidity',
  remove_liquidity: 'Remove Liquidity',
  swap_from_x_to_y: 'Swap',
  swap_from_y_to_x: 'Swap',
  faucet: 'Faucet',
};

export type BaySwapTransactionsResponse = {
  txId: string;
  type: string;
  coinSend: Coin[];
  coinReceive: Coin[];
  time: string;
};

type Coin = {
  symbol: string;
  amount: number;
};

function deduplicate(arr: string[]) {
  return arr.filter((value, index, array) => array.indexOf(value) === index);
}

function parseEvents(arr: SuiEvent[]) {
  return arr.reduce((events: any[], event: any) => {
    if (event.coinBalanceChange) {
      const { amount, coinType } = event.coinBalanceChange;
      const symbol = getSymbol(coinType);

      if (symbol && symbol !== 'SUI') {
        return [...events, { amount, symbol }];
      }

      return events;
    }

    return events;
  }, []);
}

function getAmount(events: SuiEvent[] | undefined) {
  const coinSend: Coin[] = [];
  const coinReceive: Coin[] = [];

  if (!events) return { coinSend, coinReceive };

  const coinBalanceChange = parseEvents(events).reduce((result, event) => {
    const { amount, symbol } = event;

    if (Number.isInteger(result[symbol])) {
      result[symbol] += amount;
    } else {
      result[symbol] = amount;
    }

    return result;
  }, {});

  Object.keys(coinBalanceChange).forEach((symbol) => {
    if (coinBalanceChange[symbol] < 0) {
      coinSend.push({ symbol, amount: -coinBalanceChange[symbol] });
    } else {
      coinReceive.push({ symbol, amount: coinBalanceChange[symbol] });
    }
  });

  return { coinSend, coinReceive };
}

function parseTransactions(
  arr: SuiTransactionResponse[],
  packageId: string
): BaySwapTransactionsResponse[] {
  return arr.reduce(
    (txs: BaySwapTransactionsResponse[], tx: SuiTransactionResponse) => {
      const [txKind] = getTransactions(tx.certificate);
      const moveCallTx: any = getMoveCallTransaction(txKind);

      // FIXME: compare JSON string here because different between devnet/testnet response struct
      if (moveCallTx && JSON.stringify(moveCallTx).includes(packageId)) {
        const events = getEvents(tx);
        const txId = getTransactionDigest(tx);
        const type = types[moveCallTx.function];
        const { coinSend, coinReceive } = getAmount(events);
        const time = tx.timestamp_ms
          ? formatDistance(new Date(tx.timestamp_ms), new Date(), {
              includeSeconds: true,
              addSuffix: true,
            })
          : '';

        return [...txs, { txId, type, coinSend, coinReceive, time }];
      }

      return txs;
    },
    []
  );
}

export async function getBaySwapTransactions(sdk: SDK, address: SuiAddress) {
  try {
    const txIds = await sdk._provider.getTransactionsForAddress(address, true);

    if (txIds && txIds.length > 0) {
      const txs = await sdk._provider.getTransactionWithEffectsBatch(
        deduplicate([...txIds].slice(0, 20))
      );

      return parseTransactions(txs, sdk._registry.PackageID);
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
