import BigNumber from 'bignumber.js';

export function getPercentAmount(amount: string, percent: number) {
  return BigNumber(amount)
    .multipliedBy(BigNumber(percent))
    .dividedBy(100)
    .decimalPlaces(0, 1)
    .toString();
}

export function checkError(amount: string, balance: BigNumber) {
  if (Number(amount) === 0) {
    return 'Enter An Amount';
  }

  if (balance.isLessThan(amount)) {
    return `Insufficient LP Balance`;
  }

  return null;
}
