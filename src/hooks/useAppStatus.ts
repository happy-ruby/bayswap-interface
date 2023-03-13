import { ReactNode } from 'react';

import { create } from 'zustand';

import { Status } from 'constant';

type StoreState = {
  status: Status;
  content?: ReactNode;
  setStatus: (status: Status, content?: ReactNode) => void;
};

const useAppStatus = create<StoreState>((set) => ({
  status: Status.IDLE,
  content: null,
  setStatus: (status: Status, content?: ReactNode) => set({ status, content }),
}));

export default useAppStatus;
