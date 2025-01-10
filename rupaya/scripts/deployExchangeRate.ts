import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
    console.log("Deploying ExchangeRateContract...");

    const priceFeedAddress = process.env.PRICE_FEED_ADDRESS;

    if (!priceFeedAddress) {
        throw new Error("Price feed address is not defined in the .env file");
    }

    const ExchangeRateContract = await ethers.getContractFactory("ExchangeRateContract");
    const exchangeRateContract = await ExchangeRateContract.deploy(priceFeedAddress);

    await exchangeRateContract.deployed();

    console.log(`ExchangeRateContract deployed at: ${exchangeRateContract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
