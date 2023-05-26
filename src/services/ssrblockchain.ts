import { ethers, providers } from "ethers";
import { MarketAbi, NftAbi, MarketAddress, NftAddress } from "./contract";
import { store } from "../store";
import { fromWei } from "./cssblockchain";
import { Bid, Item, UserType } from "../typings";

let ethereum: any;

if (typeof window !== "undefined") {
  ethereum = window.ethereum;
}

const NftContract = async () => {
  const provider = new providers.Web3Provider(ethereum);
  const wallet = ethers.Wallet.createRandom();
  const signer = provider.getSigner(wallet.address);
  const nftContract = new ethers.Contract(NftAddress, NftAbi.abi, signer);
  return nftContract;
};

const MarketContract = async () => {
  const provider = new providers.Web3Provider(ethereum);
  const wallet = ethers.Wallet.createRandom();
  const signer = provider.getSigner(wallet.address);
  const marketContract = new ethers.Contract(
    MarketAddress,
    MarketAbi.abi,
    signer
  );
  return marketContract;
};

export const getNftOwned = async () => {
  const { wallet } = store.getState().counter;
  const nftContract = await NftContract();
  const nftsCount = await nftContract.getCurrentTokenCount();
  const ownedNfts: any[] = [];

  for (let index = 0; index < Number(nftsCount); index++) {
    const tokenId = index + 1;
    const tokenOwner = await nftContract.ownerOf(tokenId);
    if (tokenOwner.toLowerCase() == wallet.toLowerCase()) {
      const uri = await nftContract.tokenURI(tokenId);
      const response = await fetch(uri);
      const nftMetaData = await response.json();
            const nft = {
        tokenId: tokenId,
        owner: wallet,
        name: nftMetaData.name,
        attributeList: nftMetaData.attributeList,
        description: nftMetaData.description,
        image: nftMetaData.image,
      };
      ownedNfts.push(nft);
    }
  }
  return ownedNfts;
};

export const getAvailableMarketItems = async () => {
  const nftContract = await NftContract();
  const marketContract = await MarketContract();
  const availableNfts: Item[] = [];
  const AvailableMarketNft = await marketContract.fetchAvailableMarketItems();
  for (let index = 0; index < AvailableMarketNft.length; index++) {
    const marketNft = AvailableMarketNft[index];
    const uri = await nftContract.tokenURI(marketNft.tokenId);
    const response = await fetch(uri);
    const nftMetaData = await response.json();
    const nft: Item = {
      id: Number(marketNft.marketItemId),
      name: nftMetaData.name,
      description: nftMetaData.description,
      image: nftMetaData.image,
      attributesList: nftMetaData.attributeList,
      tokenId: Number(marketNft.tokenId),
      creator: marketNft.creator,
      seller: marketNft.seller,
      owner: marketNft.owner,
      price: fromWei(marketNft.price),
      isAuction: marketNft.isAuction,
      createdAt: Number(marketNft.createdAt),
      expiresAt: Number(marketNft.expiresAt),
    };
    availableNfts.push(nft);
  }
  return availableNfts;
};

export const getMarketItem = async (marketItemId: number) => {
  const nftContract = await NftContract();
  const marketContract = await MarketContract();

  const MarketItem = await marketContract.getMarketItemById(marketItemId);
  const uri = await nftContract.tokenURI(MarketItem.tokenId);
  const response = await fetch(uri);
  const nftMetaData = await response.json();
  const marketItem: Item = {
    id: Number(MarketItem.marketItemId),
    name: nftMetaData.name,
    description: nftMetaData.description,
    image: nftMetaData.image,
    attributesList: nftMetaData.attributesList,
    tokenId: Number(MarketItem.tokenId),
    creator: MarketItem.creator,
    seller: MarketItem.seller,
    owner: MarketItem.owner,
    price: fromWei(MarketItem.price),
    isAuction: MarketItem.isAuction,
    createdAt: Number(MarketItem.createdAt),
    expiresAt: Number(MarketItem.expiresAt),
  };
  return marketItem;
};

export const getMarketItemBid = async (marketItemId: number) => {
  const marketContract = await MarketContract();
  const ItemBid = await marketContract.fetchMarketItemBid(marketItemId);
  const itemBids: any[] = [];
  for (let index = 0; index < ItemBid.length; index++) {
    const currBid = ItemBid[index];
    if (currBid?.revoke) continue;
    let bid: Bid = {
      id: Number(currBid.bidId),
      accept: currBid.accept,
      bidAmt: fromWei(currBid.bidAmt),
      bidder: currBid.bidder,
      marketItemId: Number(currBid.marketItemId),
      revoke: currBid.revoke,
      timestamp: Number(currBid.timestamp),
    }
    itemBids.push(bid)
  }
  return itemBids;
};

export const getUser = async (userAddress: string) => {
  const marketContract = await MarketContract();
  const fetchUser = await marketContract.fetchUserById(userAddress);
  const user: UserType = {
    name: fetchUser.name,
    userName: fetchUser.userName,
    description: fetchUser.description,
    profileImg: fetchUser.profileImg,
    backImg: fetchUser.backImg,
    userId: Number(fetchUser.userId),
    isUserCreate: fetchUser.userId > 0,
    userAddress: fetchUser.userAddress,
    createdAt: Number(fetchUser.createdAt),
  };
  return user;
};

export const getUserItem = async (userAddress: string) => {
  const nftContract = await NftContract();
  const marketContract = await MarketContract();
  const UserItems = await marketContract.fetchUserItem(userAddress);
  const userItems: Item[] = [];
  for (let index = 0; index < UserItems.length; index++) {
    const userItem = UserItems[index];
    const uri = await nftContract.tokenURI(userItem.tokenId);
    const response = await fetch(uri);
    const nftMetaData = await response.json();
    const item: Item = {
      id: Number(userItem.marketItemId),
      name: nftMetaData.name,
      description: nftMetaData.description,
      image: nftMetaData.image,
      attributesList: nftMetaData.attributeList,
      tokenId: Number(userItem.tokenId),
      creator: userItem.creator,
      seller: userItem.seller,
      owner: userItem.owner,
      price: fromWei(userItem.price),
      isAuction: userItem.isAuction,
      createdAt: Number(userItem.createdAt),
      expiresAt: Number(userItem.expiresAt),
    };
    userItems.push(item);
  }

  return userItems;
};

export const getUserOfferedBid = async (userAddress: string) => {
  const marketContract = await MarketContract();
  const bidCounts = await marketContract._bidIds();
  const allBids: Bid[] = [];
  for (let index = 1; index <= Number(bidCounts); index++) {
    const currBid = await marketContract.getBidById(index);
    if (userAddress.toLowerCase() !== currBid.bidder.toLowerCase()) continue;
    let bid: Bid = {
      id: Number(currBid.bidId),
      accept: currBid.accept,
      bidAmt: fromWei(currBid.bidAmt),
      bidder: currBid.bidder,
      marketItemId: Number(currBid.marketItemId),
      revoke: currBid.revoke,
      timestamp: Number(currBid.timestamp),
    };
    allBids.push(bid);
  }
  return allBids;
};

export const getUserReceivedBid = async (userAddress: string) => {
  const marketContract = await MarketContract();
  const bidCounts = await marketContract._bidIds();
  const allBids: Bid[] = [];
  for (let index = 1; index <= Number(bidCounts); index++) {
    const currBid = await marketContract.getBidById(index);
    const item = await marketContract.getMarketItemById(currBid.marketItemId);
    if (item.seller.toLowerCase() !== userAddress.toLowerCase()) continue;
    let bid: Bid = {
      id: Number(currBid.bidId),
      accept: currBid.accept,
      bidAmt: fromWei(currBid.bidAmt),
      bidder: currBid.bidder,
      marketItemId: Number(currBid.marketItemId),
      revoke: currBid.revoke,
      timestamp: Number(currBid.timestamp),
    };
    allBids.push(bid);
  }
  return allBids;
};