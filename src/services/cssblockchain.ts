import { toast } from "react-toastify";
import { ethers, BigNumberish, providers } from "ethers";
import { setBids, setCart, setItems, setNfts, setUser, setWallet } from "../store/storeSlices";
import axios from "axios";
import { store } from "../store";
import { MarketAbi, NftAbi, MarketAddress, NftAddress } from './contract'
import { getAvailableMarketItems, getMarketItemBid, getNftOwned, getUser } from "./ssrblockchain";

export const toWei = (num: string) => ethers.utils.parseEther(num);
export const fromWei = (num: BigNumberish) => ethers.utils.formatEther(num);
const key = import.meta.env.VITE_PINATA_API_KEY;
const secret = import.meta.env.VITE_PINATA_API_SECRET;

let tx, ethereum: any;

if (typeof window !== "undefined") {
  ethereum = window.ethereum;
}

const reportError = (error: any) => {
  console.log(error.message);
};

const MarketContract = async () => {
  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    MarketAddress,
    MarketAbi.abi,
    signer
  );
  return marketContract;
};

const NftContract = async () => {
  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const nftContract = new ethers.Contract(NftAddress, NftAbi.abi, signer);
  return nftContract;
};

export const walletConnect = async () => {
  try {
    if (!ethereum) {
      toast("please install metamask");
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    store.dispatch(setWallet(accounts[0]));
  } catch (error) {
    reportError(error);
  }
};

export const isWallectConnected = async () => {
  try {
    if (!ethereum) toast("please install metamask");
    const accounts = await ethereum.request({ method: "eth_accounts" });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async () => {
      store.dispatch(setWallet(accounts[0]));
      await isWallectConnected();
    });

    if (accounts.length) {
      store.dispatch(setWallet(accounts[0]));
    } else {
      store.dispatch(setWallet(""));
      toast("please connect wallet.");
      console.log("No accounts found");
    }
  } catch (error) {
    reportError(error);
  }
};

export const MintNftFunc = async (
  name: string,
  description: string,
  imageUrl: string,
  attributesList: string[]
) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!name || !description || !imageUrl || !attributesList) {
    return;
  }

  const nftJson = {
    name,
    description,
    image: imageUrl,
    attributesList
  };

  try {
    const response = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: nftJson,
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key:  secret,
      },
    });

    const metaDataUri = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

    const nftContract = await NftContract();
    tx = await nftContract.mintToken(metaDataUri, {
      from: wallet,
    });
    await tx.wait();
    const NftOwned = await getNftOwned();
    store.dispatch(setNfts(NftOwned));
  } catch (error) {
    reportError(error);
  }
};

export const NftSellFixed = async (tokenId: number, price: string) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!tokenId || !price) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    const listingFee = await marketContract.getListingFee();

    tx = await marketContract.createMarketItem(
      NftAddress,
      tokenId,
      toWei(price),
      {
        from: wallet,
        value: ethers.utils.formatUnits(listingFee, "wei"),
      }
    );
    await tx.wait();
    const NftOwned = await getNftOwned();
    store.dispatch(setNfts(NftOwned))
  } catch (error) {
    reportError(error);
  }
};

export const NftSellAuction = async (
  tokenId: number,
  price: string,
  expires: string
) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!tokenId || !price || !expires) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    const listingFee = await marketContract.getListingFee();
    const expiresAt = new Date(expires).getTime();

    tx = await marketContract.createMarketItemAuction(
      NftAddress,
      tokenId,
      toWei(price),
      expiresAt,
      {
        from: wallet,
        value: ethers.utils.formatUnits(listingFee, "wei"),
      }
    );
    await tx.wait();
    const NftOwned = await getNftOwned();
    store.dispatch(setNfts(NftOwned))
  } catch (error) {
    reportError(error);
  }
};

export const NftDelete = async (
marketItemId: number
) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!marketItemId) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    tx = await marketContract.cancelMarketItem(NftAddress, marketItemId, {
      from: wallet
    })
    await tx.wait();
    const items = await getAvailableMarketItems();
    store.dispatch(setItems(items));
  } catch (error) {
    reportError(error);
  }
}

export const NftPurchaseFixed = async (marketItemId: number, price: string) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!marketItemId) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    tx = await marketContract.createMarketSale(NftAddress, marketItemId, {
      from: wallet,
      value: toWei(price),
    });
    await tx.wait();
    const items = await getAvailableMarketItems();
    store.dispatch(setItems(items));
  } catch (error) {
    reportError(error);
  }
};

export const OfferBid = async (marketItemId: number, bidAmt: string) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!marketItemId || !bidAmt) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    tx = await marketContract.placeBid(marketItemId, {
      from: wallet,
      value: toWei(bidAmt),
    });
    await tx.wait();
    const Bids = await getMarketItemBid(marketItemId);
    store.dispatch(setBids(Bids));
  } catch (error) {
    reportError(error);
  }
};

export const revokeBid = async (bidId: number, marketItemId: number) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!bidId) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    tx = await marketContract.revoke(bidId, {
      from: wallet,
    });
    await tx.wait();
    const Bids = await getMarketItemBid(marketItemId);
    store.dispatch(setBids(Bids));
  } catch (error) {
    reportError(error);
  }
};

export const acceptBid = async (bidId: number, marketItemId: number) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;

  if (!bidId) {
    return;
  }
  try {
    const marketContract = await MarketContract(); 
    tx = await marketContract.bidAccept(NftAddress, bidId, {
      from: wallet
    });
    await tx.wait();
    const Bids = await getMarketItemBid(marketItemId);
    store.dispatch(setBids(Bids));
  } catch (error) {
    reportError(error);
  }
};

export const userCreate = async (
  name: string,
  username: string,
  description: string,
  backImage: string,
  profileUrl: string
) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;
  if (!name || !username || !description || !backImage || !profileUrl) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    tx = await marketContract.createUser(
      name,
      username,
      description,
      backImage,
      profileUrl,
      {
        from: wallet,
      }
    );
    await tx.wait();
    const user = await getUser(wallet);
    store.dispatch(setUser(user));
  } catch (error) {
    reportError(error);
  }
};

export const userUpdate = async (
  userId: number,
  name: string,
  username: string,
  description: string,
  backImage: string,
  profileUrl: string
) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;
  if (!userId || !name || !username || !description || !backImage || !profileUrl) {
    return;
  }

  try {
    const marketContract = await MarketContract();
    tx = await marketContract.updateUser(
      userId,
      name,
      username,
      description,
      backImage,
      profileUrl,
      {
        from: wallet,
      }
    );
    await tx.wait();
    const user = await getUser(wallet);
    store.dispatch(setUser(user));
  } catch (error) {
    reportError(error);
  }
};

export const buyAll = async (itemIds: number[], totalEth: string) => {
  if (!ethereum) return toast("please install metamask");
  const { wallet } = store.getState().counter;
  if (!itemIds) {
    return;
  }
  console.log(itemIds, totalEth);
  try {
    const marketContract = await MarketContract();
    tx = await marketContract.BuyAll(NftAddress, itemIds, {
      from: wallet,
      value: toWei(totalEth),
    })
    await tx.wait();
    store.dispatch(setCart([]))
  } catch (error) {
    reportError(error)
  }
}

export const truncate = (
  text: string,
  startChars: number,
  endChars: number,
  maxLength: number
) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};

export const formatDate = (timestamp: any) => {
  const date = new Date(timestamp);

  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthOfYear = monthsOfYear[date.getMonth()];
  const dateOfMonth = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const isAM = hour >= 12 ? "PM" : "AM";
  const year = date.getFullYear();

  return `${monthOfYear} ${dateOfMonth}, ${year} at ${hour}:${minute} ${isAM}`;
};
