const main = async () => {
  const [owner, randomPerson1, random2, random3, random4] =
    await hre.ethers.getSigners();

  const OneMillion = await hre.ethers.getContractFactory(
    "OneMillionSignatureDao"
  );
  const oneMillion = await OneMillion.deploy(
    [
      "0x2F069F429d036aeBD2dC13de8B63C16AE9f8bB1a",
      "0xdcd0527cc1D33411C63171c4F9488e3E0be88858",
    ],
    BigNumber.from("10000000000000000"),
    BigNumber.from("20000000000000000"),
    1000000,
    [8, 16, 24]
  );
  await oneMillion.deployed();
  console.log("Contract deployed to:", oneMillion.address);

  let tx = await oneMillion
    .connect(randomPerson1)
    ._mint(20, "Tom Holland", "https://tom.com", {
      value: 200,
    });
  tx.wait();

  tx = await oneMillion
    .connect(random4)
    ._mint(8, "Garfield", "https://garfield.com", {
      value: 160,
    });
  tx.wait();

  tx = await oneMillion._mintBossNFT("https://boss.com");
  tx.wait();

  let bossId = await oneMillion.bossNFTId();
  console.log("bossId", bossId);

  tx = await oneMillion._modifyBossNFT("https://boss2.com");
  tx.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
