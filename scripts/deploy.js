
const { ethers, upgrades } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const UbiVaultFund = await ethers.getContractFactory("UbiVaultFund");
  console.log("Deploying UBI Vault Fund...");

  const ubiVaultFund = await upgrades.deployProxy(
    UbiVaultFund,
    [
      deployer.address,
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      '0x2147935d9739da4e691b8ae2e1437492a394ebf5'
    ],
    {
      initializer: 'initialize',
      unsafeAllowCustomTypes: true 
    }
  );

  console.log("UbiVaultFund deployed to:", ubiVaultFund.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
