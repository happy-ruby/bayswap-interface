import DesktopHeader from 'components/Header/DesktopHeader';
import MobileHeader from 'components/Header/MobileHeader';
import useMediaQuery from 'hooks/useMediaQuery';

function Header() {
  const matches = useMediaQuery('(min-width: 768px)');

  if (matches) return <DesktopHeader />;

  return <MobileHeader />;
}

export default Header;
