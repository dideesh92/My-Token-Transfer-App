const hre = require("hardhat");

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");

  const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1 million tokens

  const myToken = await MyToken.deploy(initialSupply);

  await myToken.waitForDeployment();

  console.log(`MyToken deployed to: ${myToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
