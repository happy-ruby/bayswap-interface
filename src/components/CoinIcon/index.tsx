import { ReactComponent as BNBIcon } from 'assets/images/bnb.svg';
import { ReactComponent as BTCIcon } from 'assets/images/btc.svg';
import { ReactComponent as DAIIcon } from 'assets/images/dai.svg';
import { ReactComponent as ETHIcon } from 'assets/images/eth.svg';
import { ReactComponent as LPIcon } from 'assets/images/lp.svg';
import { ReactComponent as USDTIcon } from 'assets/images/usdt.svg';

type Props = {
  name: string | null;
  className?: string;
};

const Icons = {
  ETH: ETHIcon,
  BNB: BNBIcon,
  BTC: BTCIcon,
  DAI: DAIIcon,
  USDT: USDTIcon,
  LP: LPIcon,
};

function CoinIcon({ name, className }: Props) {
  if (!name) return null;

  const Icon = Icons[name];

  if (Icon) {
    return <Icon className={className} />;
  }

  return null;
}

export default CoinIcon;
