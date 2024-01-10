import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import myContract from "./ethereum/myContract";
import wethContract from "./ethereum/Weth";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [mContract, setmContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [inputAmount, setIntputAmount] = useState(0);
  const [wContract, setwContract] = useState();
  const [wethAllowance, setWethAllowance] = useState(0);

  const handleAmountChange = (event) => {
    const EtherAmount = ethers.utils.parseEther(event.target.value); ;
    setIntputAmount(parseFloat(ethers.utils.formatEther(EtherAmount)));
  };

  const SepoliaChainId = 11155111;
  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      // force to connect to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + SepoliaChainId.toString(16) }],
        });
      } catch (error) {
        console.error(error);
      }
      try {
        /* MetaMask is installed */
        const provider = new ethers.providers.Web3Provider(window.ethereum, SepoliaChainId);
        const accounts = await provider.send("eth_requestAccounts",[]);
        setWalletData(provider, accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);

        if (accounts.length > 0) {
          setWalletData(provider, accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setWalletData(provider, accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const setWalletData = async (provider, account) => {
    setSigner(provider.getSigner());
    setmContract(myContract(provider));
    setwContract(wethContract(provider));
    const allowance = await wContract.allowance(account, mContract.address);
    const wethAllowanceFormated = parseFloat(ethers.utils.formatEther(allowance));
    setWethAllowance(wethAllowanceFormated);
    setWalletAddress(account);
  };

  const bet = async (boolean) => {
    const inputAmountToWei = ethers.utils.parseUnits(inputAmount.toString());
    if (inputAmount > wethAllowance) {
      try {
        const wethContractWithSigner = wContract.connect(signer);
        const resp = await wethContractWithSigner.approve(mContract.address, inputAmountToWei );
        console.log(resp);
      } catch (err) {
        console.error(err.message);
      }  
    }
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const mContractWithSigner = mContract.connect(signer);
      const resp = await mContractWithSigner.bet(inputAmountToWei, boolean);
      console.log(resp);
      setWithdrawSuccess("Operation succeeded!");
      setTransactionData(resp.hash);
    } catch (err) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Let's Bet</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Will Lai Ching-te be the next president of Taiwan?</h1>
            <p>Stop Bet Time: 2024/01/13 00:00:00</p>
            <p>Result Reveal Time: 2024/01/14 00:00:00</p>
            <p>Current WethAllowance: {wethAllowance} </p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{"  "}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="number"
                    placeholder="Enter WETH amount you want to bet"
                    onChange={handleAmountChange}
                  />
                </div>
                
                <div className="column">
                  <button className="button is-link is-medium" onClick={() => bet(true)} disabled={walletAddress ? false : true}>
                    Yes
                  </button>
                </div>
                <div className="column">
                  <button className="button is-link is-medium" onClick={() => bet(false)} disabled={walletAddress ? false : true}>
                    No
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p>
                    {transactionData && transactionData.length > 0
                      ? <a href={`https://sepolia.etherscan.io/address/${transactionData}`} target="_blank" rel="noopener noreferrer">Transaction hash: {transactionData}</a>
                      : "--"}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
