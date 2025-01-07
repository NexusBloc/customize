import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

interface PaymentProps {
  onPaymentSuccess: () => void; // Callback for successful payment
  onClose: () => void; // Callback for closing the modal
}



const Payment: React.FC<PaymentProps> = ({ onPaymentSuccess, onClose }) => {
  const [ethAmount, setEthAmount] = useState(0.001358); // Default ETH amount
  const [tokenAmount, setTokenAmount] = useState(102335); // Default token amount
  const [account, setAccount] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Track if payment is processing

  const ethRecipient = "0x6F44823d84A93F71691C340f72be51125901F258"; // Replace with your ETH address
  const tokenRecipient = "0x6F44823d84A93F71691C340f72be51125901F258"; // Replace with your token recipient address
  // const customTokenAddress = "0x120BbDd0F0b56c14878d0Bf5d91F744413904eC5"; // Replace with your token contract address base mainnet
  const customTokenAddress = "0x09CA5014A2D6eCFb8C4741c18c8288cD90aB8908"; // Replace with your token contract address testing

  // Automatically connect wallet
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

    autoConnectWallet(); // Try to connect the wallet when the component mounts
  }, []);

  // Send ETH directly to your address
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

  // Send Custom Token directly to your address
  const sendToken = async () => {
    if (!account) return alert("Please connect your wallet first");
    if (isProcessing) return; // Prevent multiple submissions
    setIsProcessing(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        customTokenAddress,
        [
          "function transfer(address to, uint256 amount) public returns (bool)",
        ],
        signer
      );

      const tx = await tokenContract.transfer(
        tokenRecipient,
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
    <div>
      <h1>Make Payment</h1>

      {/* Wallet Connection Status */}
      <button
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: account ? "green" : "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connecting..."}
      </button>

      {/* Payment Section */}
      <div>
        <h2>Send ETH</h2>
        <p>Amount: {ethAmount} (5$) ETH</p>
        <button
          onClick={sendETH}
          disabled={isProcessing}
          style={{
            padding: "10px",
            backgroundColor: isProcessing ? "gray" : "blue",
            color: "white",
            border: "none",
            cursor: isProcessing ? "not-allowed" : "pointer",
            borderRadius: "5px",
          }}
        >
          {isProcessing ? "Processing..." : "Pay with ETH"}
        </button>
      </div>

      <div>
        <h2>Pay With $WEEP</h2>
        <p>Amount: {tokenAmount} $WEEP (~$2.5 ETH)</p>
        <button
          onClick={sendToken}
          disabled={isProcessing}
          style={{
            padding: "10px",
            backgroundColor: isProcessing ? "gray" : "blue",
            color: "white",
            border: "none",
            cursor: isProcessing ? "not-allowed" : "pointer",
            borderRadius: "5px",
          }}
        >
          {isProcessing ? "Processing..." : "Pay with Tokens"}
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
