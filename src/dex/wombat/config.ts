import dotenv from 'dotenv';
dotenv.config();
import { DexParams } from './types';
import { DexConfigMap, AdapterMappings } from '../../types';
import { Network, SwapSide } from '../../constants';
import wombatConfig from './wombat-config.json';

export const WombatConfig: DexConfigMap<DexParams> = wombatConfig;

export const Adapters: Record<number, AdapterMappings> = {
  [Network.BSC]: {
    [SwapSide.SELL]: [
      {
        name: 'BscAdapter01',
        /** @todo check index number */
        index: 12,
      },
    ],
  },
};
