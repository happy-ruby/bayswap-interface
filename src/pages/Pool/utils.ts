import { AllBalances, DetailedPoolInfo, getTypeFromSupply } from '@bayswap/sdk';
import BigNumber from 'bignumber.js';

import { getPrice } from 'connector/api';
import { DECIMALS } from 'constant';
import { getSymbol } from 'utils/transform';

export function calCurrentPoolShare(
  pool: DetailedPoolInfo,
  balances: AllBalances
) {
  const lpSupply = pool.lpTokenSupply.value;

  if (lpSupply == BigInt(0)) {
    return 0;
  }

  const lpType = getTypeFromSupply(pool.lpTokenSupply.type);
  const lpOwned = balances[lpType]?.balance ?? BigInt(0);

  const res = BigNumber(lpOwned.toString())
    .dividedBy(lpSupply.toString())
    .multipliedBy(100);

  return res.decimalPlaces(4).toNumber();
}

export function getTotalLiquid(pool: DetailedPoolInfo) {
  const totalX = BigNumber(pool.coinXReserve.toString())
    .div(BigNumber(DECIMALS))
    .multipliedBy(getPrice(getSymbol(pool.coinX)));
  const totalY = BigNumber(pool.coinYReserve.toString())
    .div(BigNumber(DECIMALS))
    .multipliedBy(getPrice(getSymbol(pool.coinY)));

  return totalX.plus(totalY).precision(7);
}

export function getTotalFee(pool: DetailedPoolInfo) {
  return getTotalLiquid(pool)
    .multipliedBy(BigNumber(3))
    .div(BigNumber(1000))
    .precision(7);
}
