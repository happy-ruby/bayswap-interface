import { useMemo, useState } from 'react';

function usePagination<T>(data: T[], limit = 5) {
  const [page, setPage] = useState(0);

  const pages = useMemo(
    () => Math.ceil(data.length / limit),
    [limit, data.length]
  );

  const rows = useMemo(
    () => [...data].slice(page * limit, page * limit + limit),
    [data, limit, page]
  );

  return { rows, pages, page, setPage };
}

export default usePagination;
