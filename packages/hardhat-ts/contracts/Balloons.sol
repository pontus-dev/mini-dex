// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Balloons
 * @author pontus-dev.eth
 * @notice An ERC20 token called Balloons
 * @dev 🎈 Balloons contract for use in the DEX
 * NOTE: functions outlined here are what work with the front end of this branch/repo. Also return variable names that may need to be specified exactly may be referenced (if you are confused, see solutions folder in this repo and/or cross reference with front-end code).
 */
contract Balloons is ERC20 {
  constructor() ERC20("Balloons", "BAL") {
    _mint(msg.sender, 1000 * 10**18);
  }
}
