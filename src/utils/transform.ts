import { AllBalances } from '@bayswap/sdk';
import BigNumber from 'bignumber.js';

import { DECIMALS } from 'constant';

export function shortenAddress(acct: string): string {
  if (acct.length > 10) {
    return (
      acct.substring(0, 5) + '..' + acct.substring(acct.length - 5, acct.length)
    );
  }

  return acct;
}

export function roundBalance(balance: bigint, decimalPlaces = 3) {
  return BigNumber(balance.toString())
    .dividedBy(BigNumber(DECIMALS))
    .decimalPlaces(decimalPlaces, 1);
}

export function roundBalanceByType(
  balances: AllBalances | null,
  coinType: string | undefined,
  decimalPlaces?: number
) {
  if (balances && coinType && balances[coinType]) {
    return roundBalance(balances[coinType].balance, decimalPlaces);
  }

  return BigNumber(0);
}

export function getSymbol(coinType: string): string {
  const symbol = coinType.replace(/<.*>/, '').match(/[^::][A-Za-z0-9]+$/);

  if (!symbol) return '';

  return symbol[0] === 'LPToken' ? 'LP' : symbol[0];
}

export function getExplorerLink(txDigest: string, network: string) {
  return `https://explorer.sui.io/transaction/${txDigest}?network=${network}`;
}
