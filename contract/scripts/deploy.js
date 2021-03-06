const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory('ProofOfTake');
    const contract = await contractFactory.deploy({
      value: hre.ethers.utils.parseEther('0.001'),
    });
  
    await contract.deployed();
  
    console.log('Contract address: ', contract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();