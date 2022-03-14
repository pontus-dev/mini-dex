// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

///@title DEX
///@author pontus-dev.eth
///@notice DEX.sol with the outline of the coming features
///@dev We want to create an automatic market where our contract will hold reserves of both ETH and 🎈 Balloons. These reserves will provide liquidity that allows anyone to swap between the assets.
contract DEX {
  IERC20 token;
  uint256 public totalLiquidity;
  mapping(address => uint256) public liquidity;

  ///@notice Emitted when ethToToken() swap transacted
  event EthToTokenSwap();

  ///@notice Emitted when tokenToEth() swap transacted
  event TokenToEthSwap();

  ///@notice Emitted when liquidity provided to DEX and mints LPTs.
  event LiquidityProvided();

  ///@notice Emitted when liquidity removed from DEX and decreases LPT count within DEX.
  event LiquidityRemoved();

  constructor(address token_addr) {
    token = IERC20(token_addr); //specifies the token address that will hook into the interface and be used through the variable 'token'
  }

  ///@notice initializes amount of tokens that will be transferred to the DEX itself from the erc20 contract mintee (and only them based on how Balloons.sol is written). Loads contract up with both ETH and Balloons.
  ///@param tokens amount to be transferred to DEX
  ///@return totalLiquidity is the number of LPTs minting as a result of deposits made to DEX contract
  ///NOTE: since ratio is 1:1, this is fine to initialize the totalLiquidity (wrt to balloons) as equal to eth balance of contract.
  function init(uint256 tokens) public payable returns (uint256) {
    require(totalLiquidity == 0, "Dex is already initialized. You cannot initialize more than once");
    totalLiquidity = address(this).balance;
    liquidity[msg.sender] = totalLiquidity;
    require(token.transferFrom(msg.sender, address(this), tokens));
    return totalLiquidity;
  }

  ///@notice returns yOutput, or yDelta for xInput (or xDelta)
  ///@dev Follow along with the [original tutorial](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90) Price section for an understanding of the DEX's pricing model and for a price function to add to your contract. You may need to update the Solidity syntax (e.g. use + instead of .add, * instead of .mul, etc). Deploy when you are done.
  function price(
    uint256 input_amount,
    uint256 input_reserve,
    uint256 output_reserve
  ) public view returns (uint256) {
    uint256 input_amount_with_fee = input_amount * 997;
    uint256 numerator = input_amount_with_fee * output_reserve;
    uint256 denominator = input_reserve * 1000 + input_amount_with_fee;
    return numerator / denominator;
  }

  ///@notice returns liquidity for a user. Note this is not needed typically due to the `liquidity()` mapping variable being public and having a getter as a result. This is left though as it is used within the front end code (App.jsx).
  function getLiquidity(address lp) public view returns (uint256) {
    return liquidity[lp];
  }

  ///@notice sends Ether to DEX in exchange for $BAL
  function ethToToken() public payable returns (uint256) {
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 tokens_bought = price(msg.value, address(this).balance - msg.value, token_reserve);
    require(token.transfer(msg.sender, tokens_bought));
    return tokens_bought;
  }

  ///@notice sends $BAL tokens to DEX in exchange for Ether
  function tokenToEth(uint256 tokens) public returns (uint256) {
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 eth_bought = price(tokens, token_reserve, address(this).balance);
    payable(msg.sender).transfer(eth_bought);
    require(token.transferFrom(msg.sender, address(this), tokens));
    return eth_bought;
  }

  ///@notice allows deposits of $BAL and $ETH to liquidity pool
  ///NOTE: parameter is the msg.value sent with this function call. That amount is used to determine the amount of $BAL needed as well and taken from the depositor.
  ///NOTE: user has to make sure to give DEX approval to spend their tokens on their behalf by calling approve function prior to this function call.
  ///NOTE: Equal parts of both assets will be removed from the user's wallet with respect to the price outlined by the AMM.
  function deposit() public payable returns (uint256) {
    uint256 eth_reserve = address(this).balance - msg.value;
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 token_amount = ((msg.value * token_reserve) / eth_reserve) + 1;
    uint256 liquidity_minted = (msg.value * totalLiquidity) / eth_reserve;
    liquidity[msg.sender] = liquidity[msg.sender] + liquidity_minted;
    totalLiquidity = totalLiquidity + liquidity_minted;
    require(token.transferFrom(msg.sender, address(this), token_amount));
    return liquidity_minted;
  }

  ///@notice allows withdrawal of $BAL and $ETH from liquidity pool
  ///NOTE: with this current code, the msg caller could end up getting very little back if the liquidity is super low in the pool. I guess they could see that with the UI.
  function withdraw(uint256 amount) public returns (uint256, uint256) {
    uint256 token_reserve = token.balanceOf(address(this));
    uint256 eth_amount = (amount * address(this).balance) / totalLiquidity;
    uint256 token_amount = (amount * token_reserve) / totalLiquidity;
    liquidity[msg.sender] = liquidity[msg.sender] - eth_amount;
    totalLiquidity = totalLiquidity - eth_amount;
    payable(msg.sender).transfer(eth_amount);
    require(token.transfer(msg.sender, token_amount));
    return (eth_amount, token_amount);
  }
}
