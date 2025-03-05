// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const fs = require("fs");
const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'",
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the contracts with the account:", await deployer.getAddress());

  const RiddleFactory = await ethers.getContractFactory("OnchainRiddle");

  const riddle_factory = await RiddleFactory.deploy();
  await riddle_factory.waitForDeployment();
  const contractAddress = await riddle_factory.getAddress();

  console.log("Contract address:", contractAddress);

  // We also save the contract's artifacts and address in the frontend and backend directories
  saveFrontendFiles(contractAddress);
}

function saveFrontendFiles(contractAddress, privateKey) {
  const fe_contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  const be_contractsDir = path.join(__dirname, "..", "backend", "src", "contracts");

  if (!fs.existsSync(fe_contractsDir)) {
    fs.mkdirSync(fe_contractsDir);
  }

  if (!fs.existsSync(be_contractsDir)) {
    fs.mkdirSync(be_contractsDir);
  }

  fs.writeFileSync(
    path.join(fe_contractsDir, "contract-address.json"),
    JSON.stringify({ address: contractAddress }, undefined, 2),
  );

  fs.writeFileSync(
    path.join(be_contractsDir, "contract-address.json"),
    JSON.stringify({ address: contractAddress }, undefined, 2),
  );

  const RiddleFactory = artifacts.readArtifactSync("OnchainRiddle");

  fs.writeFileSync(path.join(fe_contractsDir, "OnchainRiddle.json"), JSON.stringify(RiddleFactory, null, 2));
  fs.writeFileSync(path.join(be_contractsDir, "OnchainRiddle.json"), JSON.stringify(RiddleFactory, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
