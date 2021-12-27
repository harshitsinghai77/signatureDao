import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";

const INFURA_ID = "6f006a0521514865af0036763e47b34e";

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        // infuraId: "460f40a260564ac4a4f4b3fffb032dad",
      },
    },
  },
});

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
