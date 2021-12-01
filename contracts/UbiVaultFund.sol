//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
interface IWETH {
  function deposit() payable external;
  function balanceOf(address guy) external returns (uint);
  function approve(address guy, uint wad) external returns (bool);
}

// https://etherscan.io/address/0x2147935d9739da4e691b8ae2e1437492a394ebf5
interface IUbiVault {
  function deposit(uint256 wethAmount) external returns (uint256);
  function withdraw() external returns (uint256);
}

contract UbiVaultFund is Initializable {
  IWETH public weth;
  IUbiVault public ubiVault;
  address public admin;

  modifier onlyByAdmin() {
    require(admin == msg.sender, "The caller is not the admin.");
    _;
  }

  function initialize(address _admin, IWETH _weth, IUbiVault _ubiVault) public initializer {
    weth = _weth;
    ubiVault = _ubiVault;
    admin = _admin;
    weth.approve(address(this), type(uint256).max);
  }

  receive() external payable {}

  function deposit() public {
    uint256 ethBalance = address(this).balance;
    require (ethBalance > 0, "No ETH to deposit.");
    (bool success, ) = address(weth).call{value: ethBalance}(abi.encodeWithSignature("deposit()"));
    require(success, "Failed to convert to WETH");
    ubiVault.deposit(weth.balanceOf(address(this)));
  }

  function withdraw() public onlyByAdmin {
    ubiVault.withdraw();
  }
}
