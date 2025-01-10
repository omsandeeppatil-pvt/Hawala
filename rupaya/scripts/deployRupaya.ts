import { ethers } from "hardhat";
import "dotenv/config";
import { ExchangeRateContract } from "../typechain-types";  

async function main() {
    console.log("Deploying ExchangeRateContract...");

    const priceFeedAddress = process.env.PRICE_FEED_ADDRESS;

    if (!priceFeedAddress) {
        throw new Error("Price feed address is not defined in the .env file");
    }

    // Get the contract factory
    const ExchangeRateContractFactory = await ethers.getContractFactory("ExchangeRateContract");

    // Deploy the contract
    const exchangeRateContract = (await ExchangeRateContractFactory.deploy(
        priceFeedAddress
    )) as ExchangeRateContract;

    // Wait for deployment to complete
    await exchangeRateContract.deploymentTransaction().wait();

    console.log(`ExchangeRateContract deployed at: ${exchangeRateContract.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
