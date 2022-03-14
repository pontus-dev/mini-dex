import { GenericContract } from 'eth-components/ant/generic-contract';
import { useEthersContext } from 'eth-hooks/context';
import React, { FC } from 'react';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { useAppContracts } from '~~/config/contractContext';
import { NETWORKS } from '~~/models/constants/networks';
export interface IMainPageContractsProps {
  scaffoldAppProviders: IScaffoldAppProviders;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContractsProps> = (props) => {
  const ethersContext = useEthersContext();
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);
  const balloons = useAppContracts('Balloons', ethersContext.chainId);
  const dexContract = useAppContracts('DEX', ethersContext.chainId);

  if (ethersContext.account == null) {
    return <></>;
  }

  return (
    <>
      <>
        {/* **********
          ❓ this scaffolding is full of commonly used components
          this <Contract/> component will automatically parse your ABI
          and give you a form to interact with it locally
        ********** */}
        {/* **********
         * ❓ uncomment for a another contract:
         ********** */}
        {/*
          <GenericContract
            contractName="AnotherContract"
            contract={contract={contractList?.['AnotherContract']}
            mainnetProvider={props.appProviders.mainnetProvider}
            blockExplorer={props.appProviders.targetNetwork.blockExplorer}
            contractConfig={props.contractConfig}
          />
        */}

        <GenericContract
          contractName="DEX"
          contract={dexContract}
          mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        />

        <GenericContract
          contractName="Balloons"
          contract={balloons}
          mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        />
      </>
    </>
  );
};
