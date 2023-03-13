import HashLoader from 'react-spinners/HashLoader';

import styles from './style.module.css';

type Props = {
  visible?: boolean;
};

function PageLoader({ visible = true }: Props) {
  if (visible) {
    return (
      <div className={styles.backdrop}>
        <HashLoader color="#0071ff" />
      </div>
    );
  }

  return null;
}

export default PageLoader;
