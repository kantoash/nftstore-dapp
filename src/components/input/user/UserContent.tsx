import { useEffect, useState } from "react";
import ItemCard from "../nft/ItemCard";
import { useParams } from "react-router";
import { Bid, Item } from "../../../typings";
import {
  getUserItem,
  getUserOfferedBid,
  getUserReceivedBid,
} from "../../../services/ssrblockchain";
import BidUserCard from "../../BidUserCard";

const UserContent = () => {
  const [offeredbids, setOfferedBids] = useState<Bid[]>();
  const [receivedbids, setReceivedBids] = useState<Bid[]>();
  const [items, setItems] = useState<Item[]>();
  const { userAddress, action } = useParams();

  useEffect(() => {
    const fetch = async () => {
      if (!userAddress || !action) {
        return;
      }

      if (action?.toString() === "Activity") {
        const OfferedBids = await getUserOfferedBid(userAddress);
        const ReceivedBids = await getUserReceivedBid(userAddress);
        setReceivedBids(ReceivedBids);
        setOfferedBids(OfferedBids);
      } else {
        const Items = await getUserItem(userAddress);
        setItems(Items);
      }
    };
    fetch();
  }, [items, offeredbids, receivedbids]);

  return (
    <div className="p-5">
      {action?.toString() !== "Activity" ? (
        <div className="mt-10 px-6 pb-20 grid grid-cols-1 m:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-12 place-items-center w-full xl:max-w-7xl mx-auto">
          {items &&
            items.map((item) => <ItemCard item={item} key={item?.id} />)}
        </div>
      ) : (
        <div className="flex flex-col space-y-10 justify-center mt-10 w-full ">
          <div className="space-y-2">
            <h3 className="text-2xl">Offered Bids</h3>
            <div className="space-y-3 flex flex-col items-center justify-center ">
              {offeredbids?.length &&
                offeredbids.map((bid, index) => (
                  <BidUserCard bid={bid} key={index} />
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl">Received bids</h3>
            <div className="space-y-3 flex flex-col items-center justify-center ">
              {receivedbids?.length &&
                receivedbids.map((bid, index) => (
                  <BidUserCard bid={bid} key={index} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContent;