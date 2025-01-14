import { ethers } from 'ethers';

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];

const RUPA_CONTRACT_ADDRESS = "0xfD4eCAfDFd435cd23E90Da010E3E8b4e791A3D21";

export async function sendTokens(
  recipientAddress: string,
  amount: string
): Promise<string> {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    if (!ethers.isAddress(recipientAddress)) {
      throw new Error(
        "Invalid recipient address. ENS is not supported on this network."
      );
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tokenContract = new ethers.Contract(
      RUPA_CONTRACT_ADDRESS,
      ERC20_ABI,
      signer
    );

    const decimals = await tokenContract.decimals();
    const amountInWei = ethers.parseUnits(amount, decimals);

    const transaction = await tokenContract.transfer(
      recipientAddress,
      amountInWei
    );

    const receipt = await transaction.wait();
    return receipt.transactionHash;
  } catch (error: any) {
    console.error("Error in sendTokens:", error);
    throw new Error(error.message || "Transaction failed");
  }
}
