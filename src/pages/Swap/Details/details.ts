const details = [
  {
    name: 'minReceived',
    title: 'Minimum Received',
    tooltip:
      'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
  },
  {
    name: 'slippage',
    title: 'Slippage Tolerance',
    tooltip:
      'Your transaction will revert if the price changes unfavorably by more than this percentage.',
  },
  {
    name: 'priceImpact',
    title: 'Price Impact',
    tooltip:
      'The difference between the market price and your price due to trade size.',
  },
  {
    name: 'liquidityFee',
    title: 'Liquidity Provider Fee',
    tooltip: 'For each trade a small fee goes to liquidity providers.',
  },
  {
    name: 'currentPrice',
    title: 'Current Price',
    tooltip: (symbolTo: string | null, symbolFrom: string | null) =>
      `Current Price = Current ${symbolFrom} reverse / Current ${symbolTo} reverse`,
  },
];

export default details;
