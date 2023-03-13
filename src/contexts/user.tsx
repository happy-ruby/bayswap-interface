import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { AllBalances } from '@bayswap/sdk';
import { useWalletKit } from '@mysten/wallet-kit';

import useInterval from 'hooks/useInterval';
import useSDK from 'hooks/useSDK';

type Props = {
  children: ReactNode;
};

type ContextType = {
  balances: AllBalances | null;
  reloadBalances: () => Promise<void>;
};

const DELAY = 20 * 1000; // 20s

export const UserContext = createContext<ContextType | null>(null);

function UserProvider({ children }: Props) {
  const [balances, setBalances] = useState<AllBalances | null>(null);
  const { sdk } = useSDK();
  const { isConnected, currentAccount } = useWalletKit();

  const reloadBalances = useCallback(async () => {
    if (isConnected && currentAccount) {
      const balances = await sdk._query.getAllBalances(currentAccount);
      setBalances(balances);
    } else {
      setBalances(null);
    }
  }, [currentAccount, isConnected, sdk._query]);

  useInterval(reloadBalances, DELAY);

  useEffect(() => {
    reloadBalances();
  }, [reloadBalances]);

  return (
    <UserContext.Provider value={{ balances, reloadBalances }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
