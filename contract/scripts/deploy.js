// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const BigNumber = hre.ethers.BigNumber;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const defaultProvider = new hre.ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/Fdpvr1ELduCwcOyg8DRM8CPjetBYg0QB",
    "maticmum"
  );

  // let provider = new hre.ethers.providers.AlchemyProvider("rinkeby");
  const walletWithProvider = new hre.ethers.Wallet(
    "f1a63917f6fb9a06bb5f1aa3451cf457671870d9cd0f52c9ff11a5a1d586d2b4",
    defaultProvider
  );

  const OneMillionSignature = await hre.ethers.getContractFactory(
    "OneMillionSignatureDao"
  );

  // const OneMillionSignature = await (
  //   await hre.ethers.getContractFactory("OneMillionSignatureDao")
  // ).attach("0x23DB4eAC70a01a7882d284952e023Eea19789370");

  const oneMillionSignature = await OneMillionSignature.connect(
    walletWithProvider
  ).deploy(
    BigNumber.from("10000000000000000"),
    BigNumber.from("20000000000000000"),
    1000000,
    [8, 16, 24]
  );

  // [
  //   "0x2F069F429d036aeBD2dC13de8B63C16AE9f8bB1a",
  //   "0xdcd0527cc1D33411C63171c4F9488e3E0be88858",
  // ],

  // await oneMillionSignature.deployed();

  // let something = await OneMillionSignature.connect(
  //   walletWithProvider
  // ).addElegibleMembers([
  //   "0x2F069F429d036aeBD2dC13de8B63C16AE9f8bB1a",
  //   "0xdcd0527cc1D33411C63171c4F9488e3E0be88858",
  // ]);
  // something.wait();
  // console.log("Before something: ", something);

  // something = await oneMillionSignature.changeCustomUnits([100, 200, 300]);

  // let something = await oneMillionSignature.getCustomSignatureUnits();
  // console.log('After something: ', something)

  console.log(
    "OneMillionSignatureDAO deployed to:",
    oneMillionSignature.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
