import { ReactNode, createContext, useContext, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { ReactComponent as XIcon } from 'assets/images/x.svg';

import styles from './style.module.css';

type ProviderProps = {
  children: ReactNode;
};

type TriggerProps = {
  className?: string;
  children: ReactNode;
};

type ConsumerProps = {
  children: ReactNode | ((state: Store) => ReactNode);
};

type ContentProps = {
  isOpen: boolean;
  open?: () => void;
  close?: () => void;
  children: ReactNode | ((state: Store) => ReactNode);
};

type Store = {
  isOpen: boolean;
  open?: () => void;
  close?: () => void;
};

const Context = createContext<Store>({
  isOpen: false,
  open: () => undefined,
  close: () => undefined,
});

function Provider({ children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Context.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </Context.Provider>
  );
}

function Trigger({ className, children }: TriggerProps) {
  const { open } = useContext(Context);

  return (
    <button onClick={open} className={className}>
      {children}
    </button>
  );
}

function Content({ isOpen, open, close, children }: ContentProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.backdrop}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {
                y: '-100vh',
                opacity: 0,
                transition: { duration: 0.5 },
              },
              visible: {
                y: '0',
                opacity: 1,
                transition: { duration: 0.5 },
              },
            }}
            onClick={(e) => e.stopPropagation()}
            className={styles.dialog}
          >
            {close ? (
              <button onClick={close} className={styles.closeButton}>
                <XIcon className={styles.closeIcon} />
              </button>
            ) : null}

            {typeof children === 'function'
              ? children({ isOpen, open, close })
              : children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Consumer({ children }: ConsumerProps) {
  const { isOpen, open, close } = useContext(Context);

  return (
    <Content isOpen={isOpen} open={open} close={close}>
      {children}
    </Content>
  );
}

export default { Provider, Trigger, Consumer, Content };
