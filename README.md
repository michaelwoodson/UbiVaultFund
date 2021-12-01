# UBI Vault Fund

To test deploying the fund locally against a fork of mainnet, copy `.env.sample` to `.env` and enter the `ALCHEMY_KEY`. Then start the forked node:

```shell
npx hardhat node
```

To deploy to the forked node:

```shell
npx hardhat run scripts/deploy.js
```

