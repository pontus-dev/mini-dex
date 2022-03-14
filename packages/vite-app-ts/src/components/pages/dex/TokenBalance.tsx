import { useTokenBalance } from 'eth-hooks/erc';
import { BigNumber, utils } from 'ethers';
import React, { FC, useState } from 'react';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';

export interface ITokenBalanceProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  contract: any;
  address: string;
  name: string;
  balance: BigNumber | undefined;
  dollarMultiplier: number | undefined;
  img: string;
}

export const TokenBalance: FC<ITokenBalanceProps> = (props) => {
  const [dollarMode, setDollarMode] = useState(true);

  const balance = useTokenBalance(props.contract, props.address)[0];

  let floatBalance = parseFloat('0.00');

  let usingBalance = balance;

  if (typeof props.balance !== 'undefined') {
    usingBalance = props.balance;
  }

  if (usingBalance) {
    const etherBalance = utils.formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  if (props.dollarMultiplier && dollarMode) {
    displayBalance = '$' + (floatBalance * props.dollarMultiplier).toFixed(2);
  }

  return (
    <span
      style={{
        verticalAlign: 'middle',
        fontSize: 24,
        padding: 8,
        cursor: 'pointer',
      }}
      onClick={(): void => {
        setDollarMode(!dollarMode);
      }}>
      {props.img} {displayBalance}
    </span>
  );
};
