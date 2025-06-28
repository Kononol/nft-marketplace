import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Добавляем проверку аккаунта деплоера
  if (!deployer) {
    throw new Error("Deployer account not configured");
  }

  const deploymentResult = await deploy("NFTMarketplace", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    // Добавляем подтверждение для живых сетей
    waitConfirmations: hre.network.name === "hardhat" ? 0 : 2,
  });

  // Проверяем успешность деплоя
  if (!deploymentResult.newlyDeployed) {
    console.log("Reusing existing contract at", deploymentResult.address);
    return;
  }

  try {
    const yourContract = await hre.ethers.getContract<Contract>("NFTMarketplace", deployer);
    console.log("✅ Contract successfully deployed at:", deploymentResult.address);
    console.log("Your NFT name:", await yourContract.name());
  } catch (error) {
    console.error("⚠️ Contract deployment verification failed:", error);
  }
};

export default deployYourContract;

deployYourContract.tags = ["NFTMarketplace"];
