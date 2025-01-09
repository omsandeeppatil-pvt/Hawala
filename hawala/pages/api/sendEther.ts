import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { recipient, amount } = req.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_API_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount),
    });

    await tx.wait();

    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
