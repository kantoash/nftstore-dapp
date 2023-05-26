// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  

  const Marketplace = await ethers.getContractFactory("NftMarketPlace");
  const marketplace = await Marketplace.deploy(ethers.utils.parseEther('0.05'));
  await marketplace.deployed(); //deploy the NFTMarket contract
  console.log("market Address", marketplace.address);// 0x7dd5d5222013de68f1f5Fd0f6B9779aB1e8d4bAA

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketplace.address);
  await nft.deployed(); //deploy the NFT contract
  console.log("Nft Address", nft.address); // 0x012E22e580346a3EAD45b7DC87BBC51b882EbE02
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
