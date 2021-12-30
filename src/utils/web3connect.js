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

export const LogoutWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export const GetWalletProvider = async () => {
  const web3Modalprovider = await web3Modal.connect();
  const provider = new Web3Provider(web3Modalprovider);
  return provider;
};

export const defaultProvider = ethers.getDefaultProvider(
  CURRENT_NETWORK.name,
  INFURA_ID
);
