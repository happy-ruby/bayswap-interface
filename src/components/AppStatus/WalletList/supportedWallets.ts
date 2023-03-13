import ethosWallet from 'assets/images/ethos-wallet.svg';
import glassWallet from 'assets/images/glass-wallet.png';
import martianWallet from 'assets/images/martian-wallet.png';
import spacecyWallet from 'assets/images/spacecy-wallet.png';
// import suiWallet from 'assets/images/sui-wallet.svg';
import suietWallet from 'assets/images/suiet-wallet.svg';

const supportedWallets = [
  {
    name: 'Ethos Wallet',
    icon: ethosWallet,
    installLink:
      'https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli',
    recommended: true,
    display: 'Ethos',
  },
  // {
  //   name: 'Sui Wallet',
  //   icon: suiWallet,
  //   installLink:
  //     'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
  //   recommended: true,
  //   display: 'Sui',
  // },
  {
    name: 'Suiet',
    icon: suietWallet,
    installLink:
      'https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd',
    display: 'Suiet',
  },
  {
    name: 'Martian Sui Wallet',
    icon: martianWallet,
    installLink:
      'https://chrome.google.com/webstore/detail/martian-wallet-aptos-sui/efbglgofoippbgcjepnhiblaibcnclgk',
    display: 'Martian',
  },
  {
    name: 'GlassWallet',
    icon: glassWallet,
    installLink:
      'https://chrome.google.com/webstore/detail/glass-wallet-sui-wallet/loinekcabhlmhjjbocijdoimmejangoa',
    display: 'Glass',
  },
  {
    name: 'Spacecy Sui Wallet',
    icon: spacecyWallet,
    installLink:
      'https://chrome.google.com/webstore/detail/spacecy-wallet/mkchoaaiifodcflmbaphdgeidocajadp',
    display: 'Spacecy',
  },
];

export default supportedWallets;
