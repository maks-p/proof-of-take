import * as React from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/proofOfTake.json";
import TakeCard from "./components/TakeCard";
import SubmitTake from "./components/SubmitTake";

import { useState, useEffect } from "react";

const App = () => {
  const contractAddress = "0xA08B28f4870d40B9A17A78fA059CDE9a7c6A4234";
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [contract, setContract] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [takes, setTakes] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      // Check if we have access to window.ethereum
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask");
        return;
      } else {
        console.log("We have the ethereum object: ", ethereum);
      }

      // Check if we're authorized to access user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const getContract = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const proofOfTakeContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(proofOfTakeContract);
        console.log("contract set");
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendTake = async () => {
    try {
      const takeTxn = await contract.create(message, { gasLimit: 300000 });
      const res = await takeTxn.wait();
      console.log(res);
      getUserTakes();
    } catch (err) {
      console.log(err);
    }
  };

  const takesArr = [];
  const getUserTakes = async () => {
    try {
      if (contract) {
        const lastIdx = await contract.getLastTakeIndex();
        console.log(lastIdx);
        for (let i = lastIdx; i >= 0; i--) {
          const take = await contract.getTake(i);
          takesArr.push({
            text: take[0],
            timestamp: new Date(parseInt(take[1]._hex, 16) * 1000),
          });
        }
      } else {
        console.log("No contract found yet");
      }
      setTakes(takesArr);
      setMessage("");
    } catch (err) {
      console.log("getUserTakes Error: ", err);
    }
  };

  const takesContainer = (
    <>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <div>
          <h2>My Takes</h2>
          {takes.map((take, takeIdx) => (
            <div key={takeIdx}>
              <TakeCard take={take} />
            </div>
          ))}
        </div>
      )}
    </>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getContract();
    getUserTakes();
  }, [currentAccount]);

  useEffect(() => {
    setLoading(false);
  }, [takes]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendTake();
  };

  return (
    <div className="mainContainer">
      <div className="header">
        {!currentAccount ? (
          <button className="walletBtn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div>Connected</div>
        )}
      </div>
      <div className="dataContainer">
        <div className="subHeader">🚀 Proof of Take 🚀</div>
        <div className="bio">
          Preserve your hottest takes on the freshest immutable blockchain
        </div>
        <SubmitTake onSubmit={onSubmit} onChange={onChange} message={message} />
        <div>{takesContainer}</div>
      </div>
    </div>
  );
};

export default App;
