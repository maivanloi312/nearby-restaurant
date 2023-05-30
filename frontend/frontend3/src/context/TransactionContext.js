import React, { useEffect, useState } from "react";
import { ethers, utils, Wallet } from "ethers";
import { contractABI, contractAddress, byteCode } from "../utils/constants";
import Web3 from "web3";
export const TransactionContext = React.createContext();

const { ethereum } = window;

// lấy contract order
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  provider.getCode(contractAddress).then((res) => console.log(res));
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};
const web3GetContract = () => {
  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:9545/");
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  return contract;
};
export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [formData, setFormData] = useState({
    address: "0xad44FdeC24d7E2f6F45261c2Fd66Fd69e56C0ACB",
    amount: "",
    keyword: "",
    message: "",
  });
  useEffect(() => {
    console.log(web3GetContract());
    // getInfuraContract();
  }, []);

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };
  // lấy contract infura
  const getInfuraContract = () => {
    const wsProvider = new ethers.providers.WebSocketProvider(
      "wss://mainnet.infura.io/ws/v3/54a57591f73c4c4696041b6d8d1460ea",
      "rinkeby"
    );

    const wallet = new ethers.Wallet(
      "0c07df1d7dff826637d793112894610bd1081c6a989aa224466001d7fdbe311c",
      wsProvider
    );

    const signer = wallet.provider.getSigner(wallet.address);
    const contractInfura = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    contractInfura.on("Transfer", (...args) => {
      console.log(args);
    });
  };

 
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        return true;
      }
    } catch (error) {
      throw new Error("No ethereum object.");
    }
    return false;
  };




  const connectWallet = async () => {
    try {
      if (checkIfWalletIsConnected()) {
        if (!ethereum) return alert("Please install metamask");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      alert(error.message)
      // throw new Error(error.message);
    }

    return true;
  };
  // const connectWallet = async () => {
  //   const checkWalletConnect=await checkIfWalletIsConnected()
  //   try {
  //     if (!checkWalletConnect) {
  //       return false;
  //     }
  
  //       const accounts = await ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       setCurrentAccount(accounts[0]);
  //       return true;
      
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  
  // };
  const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  };
  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const { address, amount, keyword, message } = formData;
      const parsedAmount = ethers.utils.parseEther(amount);
      const transaction=await web3GetContract().methods.addToBlockchain(address,parsedAmount,message,keyword).send({
              gas:"0xb002f",
              from: currentAccount,
               to: address,
              value: parsedAmount._hex,
              data: formData,
            }, function (err, result) {
              if (err) {
                  console.log("Error!", err);
                  return null;
              }
      
      
          
      })
      return {
        from: currentAccount,
        transaction: transaction,
      };

    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const connectSmartContract = async () => {
    try {
      getEthereumContract().CreateOrder("123456");
    } catch (e) {
      console.log(e);
    }

    // console.log(getEthereumContract())
  };

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        connectSmartContract,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
