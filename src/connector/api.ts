import BigNumber from 'bignumber.js';

export const serverEndpoint = 'http://127.0.0.1:9000';

export const postRequest = async (body: any): Promise<any> => {
  const resp = await fetch(serverEndpoint, {
    method: 'post',
    body: body,
  });

  return resp.json();
};

export const getPrice = (coinSymbol: string): BigNumber => {
  switch (coinSymbol) {
    case 'BTC':
      return BigNumber(16908.9);
    case 'ETH':
      return BigNumber(1262.53);
    case 'BNB':
      return BigNumber(260.54);
    case 'USDT':
      return BigNumber(1);
    case 'DAI':
      return BigNumber(1);
    default:
      return BigNumber(1);
  }
};
