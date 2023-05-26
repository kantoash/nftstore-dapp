import { useEffect, useState, useMemo } from "react";
import { Bid, Item } from "../typings";
import { getMarketItem } from "../services/ssrblockchain";
import { useNavigate } from "react-router";

interface BidUserCardProps {
  bid: Bid;
}

const BidUserCard: React.FC<BidUserCardProps> = ({ bid }) => {
  const [item, setItem] = useState<Item>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      if (!bid?.marketItemId) {
        return;
      }
      const Item = await getMarketItem(bid.marketItemId);
      setItem(Item);
    };
    fetch();
  }, [item]);

  const createdAt = useMemo(() => {
    if (!bid?.timestamp) {
      return;
    }
    const date = new Date(bid.timestamp);
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

    return `${monthOfYear} ${dateOfMonth}`;
  }, [bid?.timestamp]);

  return (
    <div className="w-[350px] md:w-[500px] xl:w-[700px] bg-[#394b61] bg-opacity-60 p-3 rounded-xl text-gray-300 flex items-center justify-between space-x-2 text-lg">
      <div
        onClick={() => navigate(`/itemPage/${item!.id}`)}
        className="h-[40px] w-[40px] cursor-pointer"
      >
        <img
          src={`https://gateway.pinata.cloud/ipfs//${item?.image.substring(7)}`}
          alt="nft_image"
          className="h-full w-full object-cover rounded-md"
        />
      </div>
      <div>{item?.name}</div>
      <div>{createdAt}</div>
      <div>{bid?.bidAmt} ETH</div>
    </div>
  );
};

export default BidUserCard;
