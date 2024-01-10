import { ethers } from "ethers";;

const BetAbi = [
  "function total_yes_bet() external view returns(uint256)",
  "function total_no_bet() external view returns(uint256)",
  "function yes_bet(address) external view returns(uint256)",
  "function no_bet(address) external view returns(uint256)",
  "function bet(uint256 amount, bool yes)",
  "function claim(address better) external",
];

const tw2024PresidentBetContract = (provider) => {
  return new ethers.Contract(
    "0x3e1ea0A4684e87c92BDfc4CD953689D70C4A8976",
    BetAbi,
    provider
  );
}

export default tw2024PresidentBetContract;

