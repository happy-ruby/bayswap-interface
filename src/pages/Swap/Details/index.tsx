import { useCallback, useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';

import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import Tooltip from 'components/Tooltip';
import { getSymbol, roundBalance } from 'utils/transform';

import details from './details';
import styles from './style.module.css';
import PriceRate from '../PriceRate';
import {
  calculateCurrentPrice,
  calculateLiquidityFee,
  calculateMinReceived,
  calculatePriceImpact,
} from '../utils';

type Props = {
  animate?: boolean;
};

const variants = {
  hidden: {
    height: 0,
    overflow: 'hidden',
    opacity: 0,
    transition: { duration: 0.5 },
  },
  visible: {
    height: 'auto',
    overflow: 'unset',
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

function Details({ animate = true }: Props) {
  const { setValue, watch } = useFormContext();
  const {
    amountFrom,
    amountTo,
    coinFrom,
    coinTo,
    selectedPool,
    slippage,
    minReceived,
    priceImpact,
    liquidityFee,
    currentPrice,
  } = watch();

  useEffect(() => {
    if (selectedPool && amountFrom && amountTo && coinFrom && slippage) {
      setValue('minReceived', calculateMinReceived(amountTo, slippage));
      setValue(
        'priceImpact',
        calculatePriceImpact(selectedPool, coinFrom, amountFrom, amountTo)
      );

      setValue('liquidityFee', calculateLiquidityFee(selectedPool, amountFrom));

      setValue('currentPrice', calculateCurrentPrice(selectedPool));
    } else {
      setValue('minReceived', undefined);
      setValue('priceImpact', undefined);
      setValue('liquidityFee', undefined);
      setValue('currentPrice', undefined);
    }
  }, [amountFrom, amountTo, coinFrom, slippage, selectedPool, setValue]);

  const renderValue = useCallback(
    (name: string) => {
      switch (name) {
        case 'minReceived':
          return minReceived
            ? `${roundBalance(minReceived).toFormat()} ${coinTo.symbol}`
            : '-';
        case 'slippage':
          return `${Number(slippage)}%`;
        case 'priceImpact': {
          if (!priceImpact) return '-';

          return priceImpact < 0.01 ? (
            <span className={styles.lowImpact}>{'<0.01'}</span>
          ) : (
            <span className={styles.highImpact}>{priceImpact.toFixed(2)}</span>
          );
        }
        case 'liquidityFee': {
          return liquidityFee ?? '-';
        }
        case 'currentPrice': {
          return currentPrice ?? '-';
        }
        default:
          return null;
      }
    },
    [coinTo, currentPrice, liquidityFee, minReceived, priceImpact, slippage]
  );

  return (
    <AnimatePresence>
      {Boolean(selectedPool) && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={animate ? variants : {}}
          className={styles.details}
        >
          {details.map(({ name, title, tooltip }, index) => (
            <div key={index} className={styles.row}>
              <div className={styles.titleCointainer}>
                <span className={styles.title}>{title}</span>
                <Tooltip.Provider>
                  <Tooltip.Trigger className={styles.iconButton}>
                    <InfoIcon className={styles.icon} />
                  </Tooltip.Trigger>
                  <Tooltip.Consumer>
                    {typeof tooltip === 'function'
                      ? tooltip(
                          getSymbol(selectedPool.coinX),
                          getSymbol(selectedPool.coinX)
                        )
                      : tooltip}
                  </Tooltip.Consumer>
                </Tooltip.Provider>
              </div>
              <div>{renderValue(name)}</div>
            </div>
          ))}
          <PriceRate />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Details;
