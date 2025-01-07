import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, contract } = req.query;

  if (!address || !contract) {
    return res.status(400).json({ error: "Missing address or contract parameter" });
  }

  try {
    console.log("Initializing Thirdweb SDK for Sepolia...");
    const sdk = new ThirdwebSDK("base-sepolia"); // Ensure the network is correct

    console.log("Fetching NFT Collection:", contract);
    const nftCollection = await sdk.getNFTCollection(contract as string);

    if (!nftCollection) {
      console.error("NFT Collection not found:", contract);
      return res.status(404).json({ error: "NFT collection not found." });
    }

    console.log("Fetching NFTs owned by address:", address);
    const nfts = await nftCollection.getOwned(address as string);

    if (!nfts || nfts.length === 0) {
      console.log("No NFTs found for address:", address);
      return res.status(404).json({ message: "No NFTs found for this address and contract." });
    }

    console.log("NFTs fetched successfully:", nfts);
    return res.status(200).json({ nfts });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return res.status(500).json({ error: "Failed to fetch NFTs" });
  }
};

export default handler;
