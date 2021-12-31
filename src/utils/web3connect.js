import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import { INFURA_ID, CURRENT_NETWORK } from "utils/constants";

// const INFURA_ID = "6f006a0521514865af0036763e47b34e";

export const getWeb3Modal = () => {
  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    // disableInjectedProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: INFURA_ID,
        },
      },
      authereum: {
        package: Authereum, // required
      },
    },
  });
  return web3Modal;
};

export const switchNetwork = async () => {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }],
    });
  } catch (e) {
    if (e.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x61",
              chainName: "Smart Chain - Testnet",
              nativeCurrency: {
                name: "Binance",
                symbol: "BNB", // 2-6 characters long
                decimals: 18,
              },
              blockExplorerUrls: ["https://testnet.bscscan.com"],
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
  }
};

export const defaultProvider = ethers.getDefaultProvider(
  CURRENT_NETWORK.name,
  INFURA_ID
);
