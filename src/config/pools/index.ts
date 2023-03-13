import { Network } from 'constant';

import devnetPools from './devnet.json';
import testnetPools from './testnet.json';

export default {
  [Network.DEVNET]: devnetPools,
  [Network.TESTNET]: testnetPools,
};
