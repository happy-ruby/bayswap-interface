import { useCallback, useEffect, useState } from 'react';

const DELAY = 500;

function useSearch(values, keyword, conditions) {
  const [filteredValues, setFilteredValues] = useState(values);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  const isMatching = useCallback(
    (value) => {
      if (typeof conditions === 'object') {
        const { keys = [], exact = [] } = conditions;

        if (keys.length === 0) return true;

        return keys.some((key) => {
          const lowercaseValue = `${value[key]}`.toLowerCase();
          const lowercaseKeyword = debouncedKeyword.toLowerCase();

          if (exact.includes(key)) {
            return lowercaseValue === lowercaseKeyword;
          } else {
            return lowercaseValue.includes(lowercaseKeyword);
          }
        });
      }

      return true;
    },
    [debouncedKeyword, conditions]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  useEffect(() => {
    if (debouncedKeyword) {
      setFilteredValues((prevState) => prevState.filter(isMatching));
    } else {
      setFilteredValues(values);
    }
  }, [debouncedKeyword, values, isMatching]);

  return filteredValues;
}

export default useSearch;
