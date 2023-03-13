import { ReactNode } from 'react';

import styles from './style.module.css';

type Props = {
  children: ReactNode;
};

function Body({ children }: Props) {
  return <div className={styles.container}>{children}</div>;
}

export default Body;
