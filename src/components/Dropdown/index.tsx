import { ReactNode, createContext, useContext, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import useClickOutside from 'hooks/useClickOutside';

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
  close: () => void;
  children: ReactNode | ((state: Store) => ReactNode);
};

type Store = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
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
      <div className={styles.root}>{children}</div>
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
  const ref = useRef(null);

  useClickOutside(ref, () => close());

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          className={styles.dropdown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {typeof children === 'function'
            ? children({ isOpen, open, close })
            : children}
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
