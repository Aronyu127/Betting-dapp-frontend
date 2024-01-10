import { ethers } from "ethers";;

const WethAbi = [
  "function deposit() public payable",
  "function withdraw(uint wad) public",
  "function approve(address guy, uint wad) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
];

const wethContract = (provider) => {
  return new ethers.Contract(
    "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    WethAbi,
    provider
  );
}

export default wethContract;

