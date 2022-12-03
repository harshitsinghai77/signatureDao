import { ethers } from "ethers";
import ABI from "artifacts/abi.json";

export const CONTRACT_ADDRESS = "0xcAF2F8591E1Ba89210C6D690cE4d102c101Df1CC";
// rinkeby - "0x1539B8D474472766C1D3673C08922d395F2c232D";
// mumbai - "0x93535a92feEA72551aD5e1525B1C356416aBa494"

export const getContract = (signerOrProvider) => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
  return contract;
};
