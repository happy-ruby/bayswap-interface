import { Currency, DetailedPoolInfo, getAmountOut } from '@bayswap/sdk';
import BigNumber from 'bignumber.js';

import { DECIMALS } from 'constant';
import { getSymbol } from 'utils/transform';

export function calculateAmountTo(
  poolDetail: DetailedPoolInfo,
  amountFrom: string,
  coinFrom: Currency
) {
  return getAmountOut(
    poolDetail,
    BigInt(Math.round(Number(amountFrom) * DECIMALS)),
    poolDetail.coinY === coinFrom.type
  );
}

export function parseAmountTo(amountTo: bigint) {
  return BigNumber(amountTo.toString()).div(BigNumber(DECIMALS)).toString();
}

export function calculateMinReceived(amountTo: string, slippage: string) {
  return BigInt(
    BigNumber(amountTo)
      .multipliedBy(BigNumber(DECIMALS))
      .multipliedBy(BigNumber(100 - Number(slippage)).toString())
      .div(BigNumber(100))
      .decimalPlaces(0)
      .toString()
  );
}

export function calculatePriceImpact(
  selectedPool: DetailedPoolInfo,
  coinFrom: Currency,
  amountFrom: string,
  amountTo: string
) {
  const { coinXReserve, coinYReserve } = selectedPool;

  let [xWDecimals, yWDecimals] = [
    BigInt(Math.round(Number(amountFrom) * DECIMALS)),
    BigInt(Math.round(Number(amountTo) * DECIMALS)),
  ];

  if (coinFrom.type == selectedPool.coinY) {
    [xWDecimals, yWDecimals] = [yWDecimals, xWDecimals];
  }

  const newCoinXReserve = coinXReserve + xWDecimals;
  const newCoinYReserve = coinYReserve + yWDecimals;

  if (coinXReserve == BigInt(0) || newCoinYReserve == BigInt(0)) {
    return 0;
  }

  const oldRate = BigNumber(coinXReserve.toString()).dividedBy(
    BigNumber(coinYReserve.toString())
  );

  const newRate = BigNumber(newCoinXReserve.toString()).dividedBy(
    BigNumber(newCoinYReserve.toString())
  );

  let diff: BigNumber;
  if (oldRate.gt(newRate)) {
    diff = oldRate.minus(newRate);
  } else {
    diff = newRate.minus(oldRate);
  }

  const percent = diff.dividedBy(oldRate).multipliedBy(100);
  return percent.toNumber();
}

export function calculateLiquidityFee(
  selectedPool: DetailedPoolInfo,
  amountFrom: string
) {
  return BigNumber(amountFrom)
    .multipliedBy(BigNumber(selectedPool.feePercent.toString()))
    .dividedBy(BigNumber(100000))
    .toString();
}

export function calculateCurrentPrice(selectedPool: DetailedPoolInfo) {
  return BigNumber(selectedPool.coinXReserve.toString())
    .dividedBy(BigNumber(selectedPool.coinYReserve.toString()))
    .toFixed(3)
    .toString();
}

export function buildRate(selectedPool: DetailedPoolInfo, reverse: boolean) {
  if (!selectedPool) return '-';

  const rate = getAmountOut(selectedPool, BigInt(DECIMALS), reverse);

  const rateWithoutDecimals = BigNumber(rate.toString())
    .dividedBy(BigNumber(DECIMALS))
    .decimalPlaces(8)
    .toFormat();

  let [from, to] = [
    getSymbol(selectedPool.coinX),
    getSymbol(selectedPool.coinY),
  ];

  if (reverse) {
    [from, to] = [to, from];
  }

  return `1 ${from} = ${rateWithoutDecimals} ${to}`;
}

export function excludeCoin(coins: Currency[], coin: Currency) {
  if (coin) {
    return coins.filter(({ type }) => type !== coin?.type);
  }

  return coins;
}

export function checkError(
  coinFrom: Currency,
  coinTo: Currency,
  amountFrom: string,
  balanceFrom: BigNumber
) {
  if (!amountFrom) {
    return 'Enter An Amount';
  }

  if (!coinFrom || !coinTo) {
    return 'Select tokens';
  }

  if (balanceFrom.isLessThan(amountFrom)) {
    return `Insufficient ${getSymbol(coinFrom.type)} Balance`;
  }

  return null;
}
