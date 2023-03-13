export const DECIMALS = 1_000_000_000;

export const SUI = '0x2::sui::SUI';

export enum Status {
  IDLE,
  ERROR,
  SUCCESS,
  LOADING,
  CONNECTING,
  PROCESSING,
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export enum Network {
  TESTNET = 'TESTNET',
  DEVNET = 'DEVNET',
}
