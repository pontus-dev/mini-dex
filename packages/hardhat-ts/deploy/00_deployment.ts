import { ethers } from 'hardhat';
import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const deployResult: DeployResult = await deploy('Balloons', {
    from: deployer,
    log: true,
  });

  const balloonsContract = await ethers.getContractAt('Balloons', deployResult.address);

  const transaction = await balloonsContract.transfer('0x1d4BE995Ed4591159BeF16D0265f946466c33E44', ethers.utils.parseEther('10'));
  await transaction.wait();

  const dexDeployResult: DeployResult = await deploy('DEX', {
    from: deployer,
    args: [deployResult.address],
    log: true,
  });

  const dex = await ethers.getContractAt('DEX', dexDeployResult.address);
  const approveTx = await balloonsContract.approve(dex.address, ethers.utils.parseEther('100'));
  await approveTx.wait();

  const initTx = await dex.init(ethers.utils.parseEther('5'), { value: ethers.utils.parseEther('5') });
  await initTx.wait();

  // const result = await balloonsContract.transfer(dex.address, ethers.utils.parseEther('990'));
  // await result.wait();
};
export default func;
func.tags = ['Balloons'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
