import {CONTRACT_ADDRESS} from "./getContact"

export const INFURA_ID = "Fdpvr1ELduCwcOyg8DRM8CPjetBYg0QB"; //"460f40a260564ac4a4f4b3fffb032dad";

export const NETWORKS = {
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    token: "ETH",
    chainIdHex: "0x1",
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    token: "ETH",
    chainIdHex: "0x2a",
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    token: "ETH",
    chainIdHex: "0x4",
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    token: "ETH",
    chainIdHex: "0x3",
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    token: "ETH",
    chainIdHex: "0x5",
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    token: "DAI",
    chainIdHex: "0x64",
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  matic: {
    name: "matic",
    color: "#2bbdf7",
    chainId: 137,
    token: "MATIC",
    chainIdHex: "0x89",
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://polygon-rpc.com/",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://polygonscan.com/",
  },
  mumbai: {
    name: "maticmum",
    color: "#92D9FA",
    chainId: 80001,
    token: "MATIC",
    chainIdHex: "0x13881",
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: `https://rpc-mumbai.maticvigil.com/`,
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://mumbai.polygonscan.com/",
  },
};

export const getNetwork = (chainId) => {
  const chainIdStr = parseInt(chainId);
  const filtereNetwork = Object.keys(NETWORKS).filter(
    (el) => NETWORKS[el].chainId === chainIdStr
  );
  return NETWORKS[filtereNetwork[0]];
};

export const CURRENT_NETWORK = getNetwork(process.env.NEXT_PUBLIC_CHAIN_ID);

export const TRANSACTION_LINK = CURRENT_NETWORK.blockExplorer + "tx/";
// "https://rinkeby.etherscan.io/tx/";

export const OPENSEA_LINK = 'https://testnets.opensea.io/assets/mumbai/' + CONTRACT_ADDRESS

export const OPENSEA_COLLECTION_LINK = 'https://testnets.opensea.io/collection/1-million-signatures-rbidxckddt'
