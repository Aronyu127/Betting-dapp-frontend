import { ethers } from "ethers";;

const MyAbi = [
  "function getValue() external view returns(uint)",
  "function bet(uint256 amount, bool yes)",
  "function claim(address better)",
  "function current_amount() public view returns(uint)"
];

const myContract = (provider) => {
  return new ethers.Contract(
    "0x298955d3783446d5043bac671511a5faaaf90d95",
    MyAbi,
    provider
  );
}

export default myContract;

