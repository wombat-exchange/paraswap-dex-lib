import { DexParams, PoolLabels } from './types';
import { DexConfigMap, AdapterMappings } from '../../types';
import { Network, SwapSide } from '../../constants';

export const WombatExchangeConfig: DexConfigMap<DexParams> = {
  WombatExchange: {
    [Network.BSC]: {
      pools: [
        {
          name: 'MAIN',
          address: '0x312Bc7eAAF93f1C60Dc5AfC115FcCDE161055fb0',
          poolLabel: PoolLabels.MAIN,
        },
        {
          name: 'SIDE',
          address: '0x0520451B19AD0bb00eD35ef391086A692CFC74B2',
          poolLabel: PoolLabels.SIDE,
        },
        {
          name: 'BNB',
          address: '0x0029b7e8e9eD8001c868AA09c74A1ac6269D4183',
          poolLabel: PoolLabels.MAIN,
        },
        {
          name: 'wmxWOM',
          address: '0xeEB5a751E0F5231Fc21c7415c4A4c6764f67ce2e',
          poolLabel: PoolLabels.wmxWOM,
        },
        {
          name: 'mWOM',
          address: '0x083640c5dBD5a8dDc30100FB09B45901e12f9f55',
          poolLabel: PoolLabels.mWOM,
        },
        {
          name: 'FACTORY_STABLES',
          address: '0x48f6A8a0158031BaF8ce3e45344518f1e69f2A14',
          poolLabel: PoolLabels.FACTORY_STABLES,
        },
      ],
    },
  },
};

export const Adapters: Record<number, AdapterMappings> = {
  // TODO: add adapters for each chain
  // This is an example to copy
  [Network.MAINNET]: { [SwapSide.SELL]: [{ name: '', index: 0 }] },
};
