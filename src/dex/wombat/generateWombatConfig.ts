/**
 * Generate wombat config by running this file
 * cmd: yarn run ts-node src/dex/wombat/generateWombatConfig.ts
 */
import dotenv from 'dotenv';
dotenv.config();
import { MultiCallInput, MultiCallOutput } from '../../types';
import { Interface } from 'ethers/lib/utils';
import masterWombatAbi from '../../abi/wombat/masterWombat.json';
import { DummyDexHelper } from '../../dex-helper';
import { MASTER_WOMBAT_ADDRESS } from './constants';
import assetAbi from '../../abi/wombat/asset.json';
import fs from 'fs';
import path from 'path';
import poolAbi from '../../abi/wombat/pool.json';

async function generateWombatConfig() {
  const masterWomabtInterface = new Interface(masterWombatAbi);
  const avaliableNetworks = Object.keys(MASTER_WOMBAT_ADDRESS);
  const wombatConfig: Record<
    number,
    { pools: Array<{ address: string; name: string }> }
  > = {};
  for (const network of avaliableNetworks) {
    const masterWombatAddress = MASTER_WOMBAT_ADDRESS[+network];
    const dexHelper = new DummyDexHelper(+network);
    const multiCallInputs: MultiCallInput[] = [
      {
        target: masterWombatAddress,
        callData: masterWomabtInterface.encodeFunctionData('poolLength'),
      },
    ];
    let returnData: MultiCallOutput[] = [];
    if (multiCallInputs.length) {
      returnData = (
        await dexHelper.multiContract.methods
          .aggregate(multiCallInputs)
          .call({})
      ).returnData;
    }
    if (returnData.length <= 0) continue;
    const poolLength = BigInt(
      masterWomabtInterface.decodeFunctionResult(
        'poolLength',
        returnData[0],
      )?.[0],
    );

    /**
     * Asset Addresses
     */
    const multiCallInputs2: MultiCallInput[] = [];
    const assetAddresses: string[] = [];
    for (let pid = 0; pid < poolLength; pid++) {
      multiCallInputs2.push({
        target: masterWombatAddress,
        callData: masterWomabtInterface.encodeFunctionData('poolInfoV3', [pid]),
      });
    }
    let returnData2: MultiCallOutput[] = [];
    if (multiCallInputs2.length) {
      returnData2 = (
        await dexHelper.multiContract.methods
          .aggregate(multiCallInputs2)
          .call({})
      ).returnData;
    }
    if (returnData2.length <= 0) continue;
    for (const data of returnData2) {
      const info = masterWomabtInterface.decodeFunctionResult(
        'poolInfoV3',
        data,
      );
      if (!info.lpToken) continue;
      assetAddresses.push(info.lpToken);
    }

    /**
     * Pool Addresses
     */
    const assetInterface = new Interface(assetAbi);
    const multiCallInputs3: MultiCallInput[] = [];
    const allPoolAddresses: string[] = [];
    for (const assetAddress of assetAddresses) {
      multiCallInputs3.push({
        target: assetAddress,
        callData: assetInterface.encodeFunctionData('pool'),
      });
    }
    let returnData3: MultiCallOutput[] = [];
    if (multiCallInputs3.length) {
      returnData3 = (
        await dexHelper.multiContract.methods
          .aggregate(multiCallInputs3)
          .call({})
      ).returnData;
    }
    if (returnData3.length <= 0) continue;
    for (const data of returnData3) {
      const poolAddress = assetInterface.decodeFunctionResult(
        'pool',
        data,
      )?.[0];
      if (!poolAddress || allPoolAddresses.includes(poolAddress)) continue;
      allPoolAddresses.push(poolAddress);
    }

    /**
     * Filter pool addresses by Paused property
     */
    const poolInterface = new Interface(poolAbi);
    const multiCallInputs4: MultiCallInput[] = [];
    const availablePoolAddresses: string[] = [];
    for (const poolAddress of allPoolAddresses) {
      multiCallInputs4.push({
        target: poolAddress,
        callData: poolInterface.encodeFunctionData('paused'),
      });
    }

    let returnData4: MultiCallOutput[] = [];
    if (multiCallInputs4.length) {
      returnData4 = (
        await dexHelper.multiContract.methods
          .aggregate(multiCallInputs4)
          .call({})
      ).returnData;
    }
    if (
      returnData4.length <= 0 ||
      returnData4.length !== allPoolAddresses.length
    )
      continue;
    for (let i = 0; i < returnData4.length; i++) {
      const isPoolPaused = poolInterface.decodeFunctionResult(
        'paused',
        returnData4[i],
      )?.[0];
      const poolAddress = allPoolAddresses[i];
      if (
        isPoolPaused ||
        !poolAddress ||
        availablePoolAddresses.includes(poolAddress)
      )
        continue;
      availablePoolAddresses.push(poolAddress);
    }

    /**
     * Aggregate data
     */
    wombatConfig[+network] = {
      pools: availablePoolAddresses.map((address, index) => {
        return {
          address,
          name: `Wombat Pool ${index}`,
        };
      }),
    };
  }

  /*
   * Output to a JSON file
   */
  fs.writeFileSync(
    path.resolve(__dirname, 'wombat-config.json'),
    JSON.stringify({ Wombat: wombatConfig }),
  );
  // eslint-disable-next-line no-console
  console.log('Generated wombat config');
  process.exit(0);
}

generateWombatConfig();
