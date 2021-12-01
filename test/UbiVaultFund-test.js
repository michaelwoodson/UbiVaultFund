const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("UbiVaultFund", function () {

  let ubiVaultFund, mockWeth, mockUbiVault, owner, alice;

  beforeEach(async () => {
    [owner, alice] = await ethers.getSigners();
 
    mockWeth = await waffle.deployMockContract(owner, require("../artifacts/contracts/UbiVaultFund.sol/IWETH.json").abi);
    mockWeth.mock.approve.returns(true);

    mockUbiVault = await waffle.deployMockContract(owner, require("../artifacts/contracts/UbiVaultFund.sol/IUbiVault.json").abi);
    mockUbiVault.mock.withdraw.returns(200);

    const UbiVaultFund = await ethers.getContractFactory("UbiVaultFund");
    ubiVaultFund = await upgrades.deployProxy(UbiVaultFund,
      [owner.address, mockWeth.address, mockUbiVault.address],
      { initializer: 'initialize', unsafeAllowCustomTypes: true }
    );
    await ubiVaultFund.deployed();
  });

  it("Should initialize properly.", async function () {
    expect(await ubiVaultFund.weth()).to.equal(mockWeth.address);
    expect(await ubiVaultFund.ubiVault()).to.equal(mockUbiVault.address);
    //expect(mockWeth.approve).to.be.calledOnContractWith(mockUbiVault.address, new BigNumber(2).pow(256).minus(1));
  });

  it("Should receive direct eth transactions.", async function () {
    await expect(() => alice.sendTransaction({to: ubiVaultFund.address, value: 200}))
  .to.changeEtherBalances([alice, ubiVaultFund], [-200, 200]);
  });

  it("Should let alice deposit eth.", async function () {
    mockWeth.mock.deposit.returns();
    mockWeth.mock.balanceOf.returns(200);
    mockUbiVault.mock.deposit.returns(200);
    await alice.sendTransaction({to: ubiVaultFund.address, value: 200});
    await expect(() => ubiVaultFund.connect(alice).deposit()).to.changeEtherBalances([ubiVaultFund], [-200]);
  });

  it("Should let governor withdraw.", async function () {
    await ubiVaultFund.withdraw();
  });

  it("Should not let alice withdraw.", async function () {
    await expect(ubiVaultFund.connect(alice).withdraw()).to.be.reverted;
  });
});
