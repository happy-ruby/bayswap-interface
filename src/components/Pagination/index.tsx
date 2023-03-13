import { Dispatch, SetStateAction } from 'react';

import { ReactComponent as ChevronLeftIcon } from 'assets/images/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from 'assets/images/chevron-right.svg';
import { ReactComponent as ChevronsLeftIcon } from 'assets/images/chevrons-left.svg';
import { ReactComponent as ChevronsRightIcon } from 'assets/images/chevrons-right.svg';

import styles from './style.module.css';

type Props = {
  pages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

function Pagination({ pages, page, setPage }: Props) {
  if (pages > 1) {
    return (
      <div className={styles.pagination}>
        <div className={styles.buttonGroup}>
          <button
            disabled={page === 0}
            onClick={() => setPage(0)}
            className={styles.button}
          >
            <ChevronsLeftIcon />
          </button>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className={styles.button}
          >
            <ChevronLeftIcon />
          </button>
          <div className={styles.page}>{page + 1}</div>
          <button
            disabled={page === pages - 1}
            onClick={() => setPage((p) => p + 1)}
            className={styles.button}
          >
            <ChevronRightIcon />
          </button>
          <button
            disabled={page === pages - 1}
            onClick={() => setPage(pages - 1)}
            className={styles.button}
          >
            <ChevronsRightIcon />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Pagination;
