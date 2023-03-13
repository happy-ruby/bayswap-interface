import BigNumber from 'bignumber.js';

export const getPercentAmount = (amt: string, percent: number): string => {
  return BigNumber(amt)
    .multipliedBy(BigNumber(percent))
    .dividedBy(100)
    .toString();
};
