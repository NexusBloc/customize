import React, { useEffect, useState, useMemo } from "react";
import { ThirdwebNftMedia, useContract, useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Navigation from "./component/Navigation";
import styles from '../styles/Home.module.css'

function Home() {
  const router = useRouter();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
  const { contract } = useContract(contractAddress);
   const address = useAddress(); // Connected wallet address
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [correctNetwork, setCorrectNetwork] = useState<boolean>(true);

  // Target chain ID (Base Sepolia in this example)
  // const TARGET_CHAIN_ID = "84532";
   const TARGET_CHAIN_ID = "8453";

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
            <div className={styles.loading}>Loading NFTs...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : memoizedNFTs.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {memoizedNFTs.map((nft) => (
                <div
                  key={nft.metadata.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "37px",
                    padding: "10px",
                    textAlign: "center",
                    width: "200px",
                  }}
                >
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    style={{ borderRadius: "74px" }}
                       width="150px"
    height="150px"
                     />
                  <h3
                  className={styles.indexname}>{nft.metadata.name || "Unnamed NFT"}</h3>

                  {/* <button className={styles.buttoncom}
                  onClick={() => handleCustomizeClick(nft)}>
                    
        <div className={styles.dots_border} />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={styles.sparkle}>
          <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black" d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" />
          <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black" d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z" />
          <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="black" fill="black" d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z" />
        </svg>
        <span className={styles.text_buttoncom}>Customize</span> */}
      {/* </button> */}
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
