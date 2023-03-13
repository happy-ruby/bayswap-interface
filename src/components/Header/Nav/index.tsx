import { useLocation, useNavigate } from 'react-router-dom';

import routes from './routes';
import styles from './style.module.css';

type Props = {
  close?: () => void;
  className?: string;
};

function Nav({ close, className }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className={className}>
      {routes.map(({ name, to }, index) => (
        <div key={index} className={styles.route}>
          <button
            onClick={() => {
              navigate(to);
              if (close) {
                close();
              }
            }}
            className={pathname === to ? styles.linkActive : styles.link}
          >
            {name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Nav;
