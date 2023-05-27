import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { NftPurchaseFixed, formatDate, walletConnect } from "../../services/cssblockchain";
import CountDown from "../input/CountDown";
import {
  AiOutlineShoppingCart,
  AiOutlineTag,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { OfferBid } from "../../services/cssblockchain";
import { setAddCart } from "../../store/storeSlices";

const ItemSellCard = () => {
  const { wallet, pageItem } = useSelector(
    (state: RootState) => state.counter
  );
  const [bidAmtModal, setBidAmtModal] = useState(false);
  const [bidAmt, setBidAmt] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const nftPurchase = async () => {
    if (!wallet) {
     walletConnect()
      return;
    }

    if (!pageItem?.id || !pageItem?.price) {
      return;
    }
    const itemId = pageItem.id;
    const itemPrice = pageItem.price;
    await NftPurchaseFixed(itemId, itemPrice)
      .then(() => {
        toast("Nft Purchase Success");
        navigate("/");
      })
      .catch(() => {
        toast("Nft Purchase Error");
      });
  };

  const bidOffer = async () => {
    if (!wallet) {
      walletConnect()
      return;
    }

    if (!pageItem?.id || !bidAmt) {
      return;
    }
    const itemId = pageItem.id;
    await OfferBid(itemId, bidAmt)
      .then(() => {
        toast("Bid Offer Success");
      })
      .catch(() => {
        toast("Bid Offer Error");
      });
  };

  return (
    <div
      className="flex flex-col gap-3 justify-between border border-gray-300 
  mt-4 p-3 rounded-xl shadow-md "
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        {pageItem?.expiresAt && Date.now() < pageItem.expiresAt && (
          <div className="flex flex-col space-y-1 ">
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <AiOutlineClockCircle size={20} />
              <h3>Auction ends:</h3>
              <span>{formatDate(pageItem.expiresAt)}</span>
            </div>
            <CountDown timestamp={pageItem.expiresAt} />
          </div>
        )}
        <div className=" flex items-center space-x-2 text-2xl">
          <h3 className="text-gray-500">Current Price:</h3>
          <span>{pageItem?.price} ETH</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow w-full gap-2 mt-3">
        {/* buy now */}{" "}
        <div
          className="text-white bg-blue-400 py-3 px-4 rounded-xl 
      flex items-center flex-grow justify-between cursor-pointer"
        >
          <button
            onClick={nftPurchase}
            className="outline-none flex-1 text-center"
          >
            Buy Now
          </button>{" "}
          <div
            onClick={() => dispatch(setAddCart(pageItem))}
            className="border-l h-full pl-2 flex items-center"
          >
            <AiOutlineShoppingCart size={20} />
          </div>
        </div>
        {/* make offer */}
        {pageItem?.isAuction && (
          <div
            onClick={() => setBidAmtModal((val) => !val)}
            className="bg-white py-3 px-4 rounded-xl text-blue-400 flex flex-grow 
          justify-center items-center  gap-3 border border-blue-400 cursor-pointer"
          >
            <button className="outline-none"> Make Offer</button>
            <div>
              <AiOutlineTag size={20} />
            </div>
          </div>
        )}
      </div>
      {bidAmtModal && (
        <motion.div
          initial={{
            y: -100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.5,
            },
          }}
        >
          <div className="flex flex-row items-center w-full overflow-hidden rounded-xl">
            <input
              type="text"
              name="price"
              placeholder="Nft Price"
              value={bidAmt}
              onChange={(e) => setBidAmt(e.target.value)}
              className="flex-1 bg-[#394b61] bg-opacity-60 p-3 text-gray-300 placeholder:text-gray-300 border-0 focus:outline-none focus:ring-0"
              required
            />
            <div
              onClick={bidOffer}
              className="bg-white text-blue-400 whitespace-nowrap px-4 py-2.5 border-2 border-blue-400 rounded-r-xl cursor-pointer"
            >
              Confirm
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ItemSellCard;
