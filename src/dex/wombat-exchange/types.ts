import { Address } from '../../types';

export enum PoolLabels {
  MAIN = 'MAIN',
  SIDE = 'SIDE',
  BNB = 'BNB',
  qWOM = 'qWOM',
  mWOM = 'mWOM',
  wmxWOM = 'wmxWOM',
  FACTORY_STABLES = 'FACTORY_STABLES',
}

export type PoolState = {
  // TODO: poolState is the state of event
  // subscriber. This should be the minimum
  // set of parameters required to compute
  // pool prices. Complete me!
};

export type WombatExchangeData = {
  // TODO: WombatExchangeData is the dex data that is
  // returned by the API that can be used for
  // tx building. The data structure should be minimal.
  // Complete me!
  pool: Address;
};

export type DexParams = {
  pools: {
    address: Address;
    name: string;
    poolLabel: PoolLabels;
  }[];
};

export type WombatExchangeConfigInfo = {
  poolAddresses: Address[];
  pools: {
    [poolAddress: string]: WombatExchangeConfigInfo;
  };
};

export type WombatExchangePoolConfigInfo = {
  tokenAddresses: Address[];
  tokens: {
    [tokenAddress: string]: {
      tokenSymbol: string;
      tokenDecimals: number;
      assetAddress: Address;
    };
  };
};
