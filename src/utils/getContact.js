import { ethers } from "ethers";
import ABI from "artifacts/abi.json";

const CONTRACT_ADDRESS = "0x4547c4041b6849914BECc953cE444d40df9a65E7"; // rinkeby - "0x1539B8D474472766C1D3673C08922d395F2c232D";
// mumbai - "0xea14ee70cceb63316e44e3e133b86c494029096c"

export const getContract = (signerOrProvider) => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
  return contract;
};
