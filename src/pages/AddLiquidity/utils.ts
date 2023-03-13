import { DetailedPoolInfo } from '@bayswap/sdk';
import BigNumber from 'bignumber.js';

import { DECIMALS } from 'constant';

const MINIMAL_LIQUIDITY = BigInt(1000);
const BigZero = BigInt(0);

export function calPoolShare(
  xReserve: bigint,
  yReserve: bigint,
  addedX: bigint,
  addedY: bigint
) {
  const newTotal = BigNumber(
    (addedX + xReserve + addedY + yReserve).toString()
  );
  if (newTotal.eq(0)) {
    return BigNumber(0);
  }

  const addedReserved = BigNumber((addedX + addedY).toString());
  return addedReserved.div(newTotal).multipliedBy(100);
}

export function calMintedLP(
  supply: bigint,
  xReserve: bigint,
  yReserve: bigint,
  addedX: bigint,
  addedY: bigint
) {
  if (supply == BigZero) {
    const providedLiquid = BigNumber(xReserve.toString())
      .sqrt()
      .plus(BigNumber(yReserve.toString()).sqrt())
      .minus(BigNumber(MINIMAL_LIQUIDITY.toString())); // sqrt(x) + sqrt(y) - MINIMAL_LIQUIDITY

    return BigInt(providedLiquid.dividedToIntegerBy(1).toString());
  }

  const xLiq: bigint = (addedX * supply) / xReserve;
  const yLiq: bigint = (addedY * supply) / yReserve;
  if (xLiq < yLiq) {
    return xLiq;
  }

  return yLiq;
}

export function isFirstAddLiquid(pool: DetailedPoolInfo) {
  return pool?.coinXReserve == BigInt(0) && pool.coinYReserve == BigInt(0);
}

export function mulDecimals(value: string) {
  return BigInt(Math.round(Number(value) * DECIMALS).toString());
}

export function divDecimals(value: string) {
  return BigNumber(value).div(BigNumber(DECIMALS));
}

export function checkError(
  amount1: string,
  amount2: string,
  balance1: BigNumber,
  balance2: BigNumber
) {
  if (!amount1 || !amount2) {
    return 'Enter An Amount';
  }

  if (balance1.isLessThan(amount1) || balance2.isLessThan(amount2)) {
    return `Insufficient LP Balance`;
  }

  return null;
}
