import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ConnectWallet } from "@thirdweb-dev/react"; // Import from thirdweb
import styles from "../styles/customize.module.css";

interface PaymentProps {
  onPaymentSuccess: () => void; // Callback for successful payment
  onClose: () => void; // Callback for closing the modal
}

const Payment: React.FC<PaymentProps> = ({ onPaymentSuccess, onClose }) => {
  const [ethAmount, setEthAmount] = useState(0.001358); // Default ETH amount
  const [tokenAmount, setTokenAmount] = useState(102335); // Default token amount
  const [account, setAccount] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Track if payment is processing

  const reciever = process.env.NEXT_PUBLIC_RECP_ADDRESS;
  const customaddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as string;

  const ethRecipient = reciever || ""; // Ensure it's not undefined
  const customTokenAddress = customaddress; // Ensure it's not undefined

  useEffect(() => {
    const autoConnectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
          console.log("Wallet automatically connected:", accounts[0]);
        } catch (error) {
          console.error("Error during automatic wallet connection:", error);
        }
      } else {
        console.warn("MetaMask is not installed.");
      }
    };

    autoConnectWallet(); // Auto-connect when the component mounts
  }, []);

  const sendETH = async () => {
    if (!account) return alert("Please connect your wallet first");
    if (isProcessing) return; // Prevent multiple submissions
    setIsProcessing(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: ethRecipient,
        value: ethers.utils.parseEther(ethAmount.toString()),
      });

      console.log("Transaction hash (ETH):", tx.hash);
      await tx.wait(); // Wait for confirmation
      alert("Payment successful!");
      onPaymentSuccess(); // Notify parent component
    } catch (error) {
      console.error("Error sending ETH:", error);
      alert("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendToken = async () => {
    if (!account) return alert("Please connect your wallet first");
    if (isProcessing) return; // Prevent multiple submissions
    setIsProcessing(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        customTokenAddress,
        ["function transfer(address to, uint256 amount) public returns (bool)"],
        signer
      );

      const tx = await tokenContract.transfer(
        ethRecipient,
        ethers.utils.parseUnits(tokenAmount.toString(), 18) // Adjust decimals as per your token
      );

      console.log("Transaction hash (Token):", tx.hash);
      await tx.wait(); // Wait for confirmation
      alert("Payment successful!");
      onPaymentSuccess(); // Notify parent component
    } catch (error) {
      console.error("Error sending token:", error);
      alert("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.payee}>
      <h1>PAYMENT GATEWAY</h1>

      {/* Wallet Connection Status */}
      {account ? (
        <button
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </button>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <ConnectWallet /> {/* Thirdweb wallet connect */}
        </div>
      )}

      {/* Payment Section */}
      <div className={styles.eth}>
        <button onClick={sendETH} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay with ETH (~$5)"}
        </button>
      </div>

      OR

      <div className={styles.weep}>
        <button onClick={sendToken} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay with $WEEP (~$2.5)"}
        </button>
      </div>

      {/* Close Modal */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={onClose}
          style={{
            padding: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Payment;
