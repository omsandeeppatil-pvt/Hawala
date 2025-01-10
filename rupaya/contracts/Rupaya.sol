// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IExchangeRateContract {
    function getExchangeRate() external view returns (uint256);
}

contract Rupaya is ERC20, Ownable {
    IExchangeRateContract public exchangeRateContract;

    event ExchangeRateContractUpdated(address indexed oldContract, address indexed newContract);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor to initialize the Rupaya token with supply and exchange rate contract.
     * @param initialSupply Initial token supply in 18 decimals.
     * @param _exchangeRateContract Address of the ExchangeRateContract.
     */
    constructor(uint256 initialSupply, address _exchangeRateContract) ERC20("Rupaya", "Rs") {
        require(_exchangeRateContract != address(0), "Invalid exchange rate contract address");
        _mint(msg.sender, initialSupply);
        exchangeRateContract = IExchangeRateContract(_exchangeRateContract);
    }

    /**
     * @dev Allows the owner to update the exchange rate contract address.
     * @param newExchangeRateContract Address of the new ExchangeRateContract.
     */
    function updateExchangeRateContract(address newExchangeRateContract) external onlyOwner {
        require(newExchangeRateContract != address(0), "Invalid address");
        address oldContract = address(exchangeRateContract);
        exchangeRateContract = IExchangeRateContract(newExchangeRateContract);
        emit ExchangeRateContractUpdated(oldContract, newExchangeRateContract);
    }

    /**
     * @dev Fetch the current INR/USD exchange rate from the ExchangeRateContract.
     * @return uint256 Current exchange rate in 18 decimals.
     */
    function getCurrentExchangeRate() public view returns (uint256) {
        return exchangeRateContract.getExchangeRate();
    }

    /**
     * @dev Mint new tokens to a specified address. Only callable by the owner.
     * @param to Address to receive the minted tokens.
     * @param amount Amount of tokens to mint in 18 decimals.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn tokens from the caller's balance.
     * @param amount Amount of tokens to burn in 18 decimals.
     */
    function burn(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Overrides the transfer function to ensure proper token transfers.
     * Can include logic tied to the current exchange rate if required.
     * @param recipient Address of the recipient.
     * @param amount Amount to transfer.
     * @return bool True if the transfer is successful.
     */
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(recipient != address(0), "Cannot transfer to zero address");
        uint256 rate = getCurrentExchangeRate();
        require(rate > 0, "Exchange rate unavailable");
        return super.transfer(recipient, amount);
    }
}
