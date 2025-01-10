// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol

import "@openzeppelin/contracts/access/Ownable.sol";

contract ExchangeRateContract is Ownable {
    AggregatorV3Interface public priceFeed; // Chainlink Price Feed
    uint256 public manualExchangeRate;      // Manual fallback exchange rate (18 decimals)
    bool public useManualRate;              // Whether to use the manual rate

    event ExchangeRateUpdated(uint256 oldRate, uint256 newRate);
    event ManualRateToggled(bool useManual);

    /**
     * @dev Constructor to initialize the price feed address.
     * @param _priceFeed Address of the Chainlink Price Feed contract.
     */
    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @dev Fetch the current INR/USD exchange rate.
     * @return uint256 The current exchange rate in 18 decimals.
     */
    function getExchangeRate() public view returns (uint256) {
        if (useManualRate) {
            return manualExchangeRate;
        } else {
            (, int256 price, , , ) = priceFeed.latestRoundData();
            require(price > 0, "Invalid price from feed");
            return uint256(price) * 10 ** 10; // Convert to 18 decimals
        }
    }

    /**
     * @dev Updates the manual exchange rate. Only callable by the owner.
     * @param newRate The new manual exchange rate in 18 decimals.
     */
    function updateManualExchangeRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be positive");
        uint256 oldRate = manualExchangeRate;
        manualExchangeRate = newRate;
        emit ExchangeRateUpdated(oldRate, newRate);
    }

    /**
     * @dev Toggles between manual and Chainlink rate. Only callable by the owner.
     * @param _useManual True to use the manual rate, false to use Chainlink rate.
     */
    function toggleManualRate(bool _useManual) external onlyOwner {
        useManualRate = _useManual;
        emit ManualRateToggled(_useManual);
    }
}
