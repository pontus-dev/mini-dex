import { Card, Col, Divider, Input, Row } from 'antd';
import { Address } from 'eth-components/ant';
import { GenericContract } from 'eth-components/ant/generic-contract';
import { useBalance, useContractReader } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { useTokenBalance } from 'eth-hooks/erc';
import { ethers } from 'ethers';
import React, { useState, FC, PropsWithChildren } from 'react';

import { Curve } from './Curve';
import { TokenBalance } from './TokenBalance';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { ERC20, DEX as DexContract } from '~~/generated/contract-types';

const tokenName = 'Balloons';

export interface IDEXProps<TokenContract extends ERC20> {
  tokenContract: TokenContract;
  dexContract: DexContract | undefined;
  scaffoldAppProviders: IScaffoldAppProviders;
}

export const DEX = <TokenContract extends ERC20>(
  props: PropsWithChildren<IDEXProps<TokenContract>>
): ReturnType<FC<IDEXProps<TokenContract>>> => {
  const display = [];
  const [values, setValues] = useState<Record<string, string>>({});
  const ethersContext = useEthersContext();
  const account = ethersContext?.account ?? '';
  const dexAddress = props.dexContract?.address ?? '';
  const contractBalance = useBalance(dexAddress)[0];
  const tokenBalance = useTokenBalance(props.tokenContract, dexAddress)[0];
  const tokenBalanceFloat = parseFloat(ethers.utils.formatEther(tokenBalance));
  const ethBalanceFloat = parseFloat(ethers.utils.formatEther(contractBalance));
  const contractName = useContractReader(props.tokenContract, props.tokenContract?.name);
  const [liquidity, _update] = useContractReader(
    /* the contract */
    props.dexContract,
    /* the contract variable or function to read */
    props.dexContract?.totalLiquidity
  );

  const rowForm = (title: string, icon: string, onClick: any): React.RefAttributes<HTMLDivElement> => {
    return (
      <Row>
        <Col span={8} style={{ textAlign: 'right', opacity: 0.333, paddingRight: 6, fontSize: 24 }}>
          {title}
        </Col>
        <Col span={16}>
          <div style={{ cursor: 'pointer', margin: 2 }}>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>): any => {
                const newValues: Record<string, string> = { ...values };
                newValues[title] = e.target.value;
                setValues(newValues);
              }}
              value={values[title]}
              addonAfter={
                <div
                  onClick={(): void => {
                    onClick(values[title]);
                    const newValues = { ...values };
                    newValues[title] = '';
                    setValues(newValues);
                  }}>
                  {icon}
                </div>
              }
            />
          </div>
        </Col>
      </Row>
    );
  };

  {
    display.push(
      <div>
        {rowForm('ethToToken', '💸', async (value: string) => {
          const valueInEther = ethers.utils.parseEther('' + value);
          const swapEthToTokenResult = await props.dexContract?.ethToToken({ value: valueInEther });
          console.log('swapEthToTokenResult:', swapEthToTokenResult);
        })}

        {rowForm('tokenToEth', '🔏', async (value: string) => {
          const valueInEther = ethers.utils.parseEther('' + value);
          console.log('valueInEther', valueInEther);
          const allowance = await props.tokenContract.allowance(account, dexAddress);
          console.log('allowance', allowance);

          let approveTx;
          if (allowance.lt(valueInEther)) {
            approveTx = await props.tokenContract.approve(dexAddress, valueInEther, {
              gasLimit: 200000,
            });
          }
          const swapTx = await props.dexContract?.tokenToEth(valueInEther, { gasLimit: 200000 });
          if (approveTx) {
            console.log('waiting on approve to finish...');
            const approveTxResult = await approveTx.wait();
            console.log('approveTxResult:', approveTxResult);
          }
          const swapTxResult = await swapTx?.wait();
          console.log('swapTxResult:', swapTxResult);
        })}

        <Divider> Liquidity ({liquidity ? ethers.utils.formatEther(liquidity) : 'none'}):</Divider>

        {rowForm('deposit', '📥', async (value: number) => {
          const valueInEther = ethers.utils.parseEther(value.toString());
          const valuePlusExtra = ethers.utils.parseEther((value * 1.03).toString());
          console.log('valuePlusExtra', valuePlusExtra);
          const allowance = await props.tokenContract.allowance(account, dexAddress);
          console.log('allowance', allowance);
          if (allowance.lt(valuePlusExtra)) {
            await props.tokenContract.approve(dexAddress, valuePlusExtra, {
              gasLimit: 200000,
            });
          }
          await props.dexContract?.deposit({ value: valueInEther, gasLimit: 200000 });
        })}

        {rowForm('withdraw', '📤', async (value: number) => {
          const valueInEther = ethers.utils.parseEther(value.toString());
          const withdrawTxResult = await props.dexContract?.withdraw(valueInEther);
          console.log('withdrawTxResult:', withdrawTxResult);
        })}
      </div>
    );
  }

  return (
    <Row>
      <Col span={12}>
        <Card
          title={
            <div>
              <Address address={dexAddress} />
              <div style={{ float: 'right', fontSize: 24 }}>
                {parseFloat(ethers.utils.formatEther(contractBalance)).toFixed(4)} ⚖️
                <TokenBalance
                  name={tokenName}
                  img={'🎈'}
                  address={dexAddress}
                  contract={props.tokenContract}
                  scaffoldAppProviders={props.scaffoldAppProviders}
                  balance={undefined}
                  dollarMultiplier={undefined}
                />
              </div>
            </div>
          }
          size="default"
          loading={false}>
          {display}
        </Card>
        {/* <Row span={12}> */}
        <Row>
          <GenericContract
            contract={props.tokenContract}
            mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
            contractName={contractName[0] ? contractName[0] : ''}
            show={['balanceOf', 'approve']}
            blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
          />
        </Row>
      </Col>
      <Col span={12}>
        <div style={{ padding: 20 }}>
          <Curve
            addingEth={values && values['ethToToken'] ? parseFloat(values['ethToToken']) : 0}
            addingToken={values && values['tokenToEth'] ? parseFloat(values['tokenToEth']) : 0}
            ethReserve={ethBalanceFloat}
            tokenReserve={tokenBalanceFloat}
            width={500}
            height={500}
          />
        </div>
      </Col>
    </Row>
  );
};
