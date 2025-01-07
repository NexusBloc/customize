import React, { useEffect, useState, useMemo } from "react";
import { ThirdwebNftMedia, useContract, useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Navigation from "./component/Navigation";

function Home() {
  const router = useRouter();
  // const contractAddress = process.env.REACT_APP_TW_CONTRACT_ADDRESS || "0xE73c168e09dAb01D699B43C54FCFF3C9ec3bb704";
  const { contract } = useContract("0xE73c168e09dAb01D699B43C54FCFF3C9ec3bb704");  //basesepolia
  // const { contract } = useContract("0x20b96003cE0cB506C30a21e8912d6733A992bc4f");

  const address = useAddress(); // Connected wallet address
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [correctNetwork, setCorrectNetwork] = useState<boolean>(true);

  // Target chain ID (Base Sepolia in this example)
  const TARGET_CHAIN_ID = "84532";
  //  const TARGET_CHAIN_ID = "8453";

  // Memoized NFT data to avoid re-fetching
  const memoizedNFTs = useMemo(() => ownedNFTs, [ownedNFTs]);

  // Check and switch network
  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        if (currentChainId !== TARGET_CHAIN_ID) {
          setCorrectNetwork(false);
          // Prompt user to switch network
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexValue(Number(TARGET_CHAIN_ID)) }],
          });
          setCorrectNetwork(true);
        } else {
          setCorrectNetwork(true);
        }
      } catch (error) {
        console.error("Error checking or switching network:", error);
        setCorrectNetwork(false);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    checkNetwork();
  }, []);

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!contract || !address || !correctNetwork) return;

      try {
        setIsLoading(true);
        setError(null);
        const nfts = await contract?.erc721?.getOwned(address); // Fetch NFTs owned by the connected wallet
        setOwnedNFTs(nfts);
      } catch (err) {
        console.error("Error fetching owned NFTs:", err);
        setError("Failed to fetch NFTs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!memoizedNFTs.length && address) {
      fetchOwnedNFTs(); // Fetch only if NFTs are not already cached
    }
  }, [contract, address, memoizedNFTs, correctNetwork]);

  const handleCustomizeClick = (nft: any) => {
    // Construct the URL with query parameters
    router.push({
      pathname: "/customize",
      query: {
        id: nft.metadata.id,
        name: nft.metadata.name,
        image: nft.metadata.image,
      },
    });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            {!address ? (
        <div>
          <p>Please connect your wallet to view your NFTs.</p>
          <ConnectWallet />
        </div>
      ) : !correctNetwork ? (
        <div>
          <p style={{ color: "red" }}>
            Please switch to the correct network (Base Sepolia) to view your NFTs.
          </p>
        </div>
      ) : (
        <>
        <Navigation/>
          {/* <ConnectWallet /> */}
          {isLoading && !memoizedNFTs.length ? (
            <div>Loading NFTs...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : memoizedNFTs.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {memoizedNFTs.map((nft) => (
                <div
                  key={nft.metadata.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    textAlign: "center",
                    width: "200px",
                  }}
                >
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    style={{ borderRadius: "8px" }}
                    height="150px"
                    width="150px"
                  />
                  <h3>{nft.metadata.name || "Unnamed NFT"}</h3>
                  <button
                    onClick={() => handleCustomizeClick(nft)}
                    style={{
                      marginTop: "10px",
                      padding: "5px",
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Customize
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>No NFTs found in your collection for this wallet.</div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
