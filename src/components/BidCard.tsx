import { useState, useEffect, useMemo } from "react";
import { Bid, UserType } from "../typings";
import {
  acceptBid,
  revokeBid,
  truncate,
} from "../services/cssblockchain";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getUser } from "../services/ssrblockchain";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface BidProps {
  bid: Bid;
}

const BidCard: React.FC<BidProps> = ({ bid }) => {
  const [bidder, setBidder] = useState<UserType>();
  const { wallet, pageItem } = useSelector((state: RootState) => state.counter);
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      if (!bid?.bidder) {
        return;
      }
      const Bidder = await getUser(bid.bidder);
      setBidder(Bidder);
    };
    fetch();
  }, [bidder]);

  const RevokeBid = async () => {
    if (!wallet) {
      toast("Metamask wallet not connected");
    }
    if (!bid?.id || !pageItem?.id) {
      return;
    }
    const bidId = Number(bid.id);
    const marketItemId = Number(pageItem.id);
    await revokeBid(bidId, marketItemId)
      .then(() => {
        toast("bid revoke Success");
        navigate(0);
      })
      .catch(() => {
        toast("bid revoke error");
      });
  };

  // accept
  const AcceptBid = async () => {
    if (!wallet) {
      toast("Metamask wallet not connected");
    }
    if (!bid?.id || !pageItem?.id) {
      return;
    }
    const bidId = Number(bid.id);
    const marketItemId = Number(pageItem.id);
    await acceptBid(bidId, marketItemId)
      .then(() => {
        toast("bid Accept Success");
        // navigate('/')
      })
      .catch(() => {
        toast("bid Accept error");
      });
  };

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
    <div className="w-full h-[50px] rounded-xl overflow-hidden text-gray-200 flex items-center justify-between">
      {/* bid info */}
      <div className=" h-full px-5 p-3 flex flex-1 text-sm md:text-base items-center justify-between bg-[#394b61] bg-opacity-50 ">
        <div>{bid?.bidAmt} ETH</div>
        <div>
          {bidder?.userName ? (
            <div>{bidder.userName}</div>
          ) : (
            <div>{bid?.bidder && truncate(bid.bidder, 4, 4, 11)}</div>
          )}
        </div>
        <div>{createdAt}</div>
      </div>

      <div>
        {bid?.bidder.toLowerCase() === wallet.toLowerCase() ? (
          <div
            onClick={RevokeBid}
            className="h-full flex items-center px-5 p-3 bg-[#394b61] hover:bg-[#303f51] cursor-pointer"
          >
            revoke
          </div>
        ) : (
          pageItem?.seller.toLowerCase() === wallet.toLowerCase() && (
            <div
              onClick={AcceptBid}
              className="h-full flex items-center px-5 p-3 bg-[#394b61] hover:bg-[#303f51] cursor-pointer border-2 border-[#303f51]"
            >
              accept
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BidCard;
