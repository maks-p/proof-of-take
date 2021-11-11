const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory('ProofOfTake');
    const contract = await contractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1')
    });
    await contract.deployed();
    console.log('Contract addy:', contract.address);
    
    /*
    Get Contract Balance
    */
    let contractBalance = await hre.ethers.provider.getBalance(
        contract.address
    );
    console.log('Contract Balance: ', hre.ethers.utils.formatEther(contractBalance));

    let totalTakes;
    totalTakes = await contract.getTotalTakes();
    console.log(totalTakes.toNumber());
  
    let txn = await contract.create('This is a take');
    await txn.wait(); 
  
    const [_, randomPerson] = await hre.ethers.getSigners();
    txn = await contract.connect(randomPerson).create('Another take');
    await txn.wait(); 
  
    totalTakes = await contract.getTotalTakes();
    console.log(totalTakes.toNumber());

    contractBalance = await hre.ethers.provider.getBalance(
        contract.address
    );
    console.log('Contract Balance: ', hre.ethers.utils.formatEther(contractBalance));
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