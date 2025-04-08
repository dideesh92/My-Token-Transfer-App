import { useEffect, useState } from "react";
import { ethers } from "ethers";
import tokenABI from "./abi/MyToken.json";

const tokenAddress = "0x2F4D46027d0aC3337d215F3439731b038d7eF43D";

function App() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User rejected connection:", err);
      }
    } else {
      alert("MetaMask not found!");
    }
  };

  const transferToken = async () => {
    if (!amount || !recipient) return alert("Enter all fields");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, tokenABI.abi, signer);

      const tx = await token.transfer(recipient, ethers.parseUnits(amount, 18));
      await tx.wait();

      const now = new Date();
      const newTx = {
        from: account,
        to: recipient,
        amount,
        date: now.toLocaleString(),
        txHash: tx.hash,
      };

      setTransactions([newTx, ...transactions]);
      setAmount("");
      setRecipient("");

      alert("Transfer successful!");
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed. See console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-yellow-300 to-violet-500 p-8">
      <div className="p-8 text-center bg-white bg-opacity-80 rounded-xl shadow-xl w-full max-w-xl">
        <h1 className="text-3xl mb-4 font-bold">MyToken Transfer</h1>
        <p className="mb-4">Connected Wallet: {account || "Not connected"}</p>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border p-2 m-2 w-full"
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 m-2 w-full"
        />
        <button
          onClick={transferToken}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
        >
          Send Token
        </button>
      </div>

      {transactions.length > 0 && (
        <div className="mt-8 bg-white bg-opacity-80 p-6 rounded-xl shadow-xl w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">Successful Transfers</h2>
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {transactions.map((tx, index) => (
              <li key={index} className="border-b pb-2">
                <p><strong>From:</strong> {tx.from}</p>
                <p><strong>To:</strong> {tx.to}</p>
                <p><strong>Amount:</strong> {tx.amount} MTK</p>
                <p><strong>Date:</strong> {tx.date}</p>
                <p><strong>Tx Hash:</strong> <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{tx.txHash.slice(0, 20)}...</a></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
