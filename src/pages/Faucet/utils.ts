export type Coin = {
  coinSymbol: string;
  coinType: string;
  treasuryCapID: string;
};

export function sortCoins(coins: Coin[]) {
  return coins.sort(function (a, b) {
    if (a.coinSymbol.toLowerCase() < b.coinSymbol.toLowerCase()) {
      return -1;
    }

    if (a.coinSymbol.toLowerCase() > b.coinSymbol.toLowerCase()) {
      return 1;
    }

    return 0;
  });
}
