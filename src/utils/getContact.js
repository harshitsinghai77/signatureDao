import { ethers } from "ethers";
import ABI from "artifacts/abi.json";

const CONTRACT_ADDRESS = "0x1539B8D474472766C1D3673C08922d395F2c232D";

export const getContract = (signerOrProvider) => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
  return contract;
};
