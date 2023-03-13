import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { WalletKitProvider } from '@mysten/wallet-kit';

import AppStatus from 'components/AppStatus';
import Body from 'components/Body';
import Footer from 'components/Footer';
import Header from 'components/Header';
import ThemeProvider from 'contexts/theme';
import UserProvider from 'contexts/user';
import AddLiquidity from 'pages/AddLiquidity';
import Faucet from 'pages/Faucet';
import History from 'pages/History';
import Pool from 'pages/Pool';
import RemoveLiquidity from 'pages/RemoveLiquidity';
import Swap from 'pages/Swap';

export default function App() {
  return (
    <WalletKitProvider>
      <ThemeProvider>
        <UserProvider>
          <AppStatus />
          <BrowserRouter>
            <Header />
            <Body>
              <Routes>
                <Route index element={<Swap />} />
                <Route path="pool" element={<Pool />} />
                <Route path="faucet" element={<Faucet />} />
                <Route path="history" element={<History />} />
                <Route path="add-liquidity" element={<AddLiquidity />}>
                  <Route path=":poolID" element={<AddLiquidity />} />
                </Route>
                <Route path="remove-liquidity" element={<RemoveLiquidity />}>
                  <Route path=":poolID" element={<RemoveLiquidity />} />
                </Route>
              </Routes>
            </Body>
            <Footer />
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </WalletKitProvider>
  );
}
