import { DefaultAddressRegistries, SDK } from '@bayswap/sdk';
import { create } from 'zustand';

import { Network } from 'constant';

type Store = {
  sdk: SDK;
  changeSDK: (network: Network) => void;
};

const SDKs = {
  [Network.DEVNET]: new SDK(),
  [Network.TESTNET]: new SDK({
    url: 'https://fullnode.testnet.vincagame.com',
    registry: DefaultAddressRegistries.TESTNET,
    network: 'TESTNET',
  }),
};

const useSDK = create<Store>((set) => ({
  sdk: SDKs.DEVNET,
  changeSDK: (network: Network) => set({ sdk: SDKs[network] }),
}));

export default useSDK;
