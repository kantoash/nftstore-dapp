import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ItemSellCard from "./ItemSellCard";
import { useNavigate } from "react-router";
import { NftDelete, truncate } from "../../services/cssblockchain";
import BidCard from "../BidCard";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

const ItemInfo = () => {
  const { pageItem, user, bids, wallet } = useSelector(
    (state: RootState) => state.counter
  );
  const navigate = useNavigate();
  const deleteItem = async () => {
    if (!wallet) {
      toast("Metamask wallet not connected");
    }
    if (!pageItem?.id) {
      return;
    }
 
    const itemId = Number(pageItem.id);
    await NftDelete(itemId)
      .then(() => {
        toast("Nft Delete Success");
        navigate("/");
      }).catch(() => {
        toast("Nft Delete Error");
      });      
  };
  return (
    <div className="mt-20 w-5/6 mx-auto flex flex-col lg:flex-row justify-center gap-8 pb-20">
      <div className=" aspect-square h-[500px] w-full lg:w-[600px] shrink-0  overflow-hidden rounded-xl ">
        {/* image */}
        <img
          src={`https://gateway.pinata.cloud/ipfs//${pageItem?.image.substring(
            7
          )}`}
          alt="nft_image"
          className="h-full w-full object-center"
        />
      </div>
      <div className="flex flex-col justify-center space-y-2 pb-5">
        <div className="flex items-center justify-between text-2xl">
          <div className="flex items-center">
            <h3>Dectable #</h3>
            <span>{pageItem?.id}</span>
          </div>{" "}
          {pageItem?.seller.toLowerCase() === wallet.toLowerCase() && (
            <div onClick={deleteItem} className="cursor-pointer">
              <AiOutlineDelete />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 text-lg">
          <h3>Owned by</h3>
          {user?.isUserCreate ? (
            <span
              onClick={() => navigate(`/user/${user?.userAddress}/Collected`)}
              className="text-blue-500 cursor-pointer"
            >
              {user?.userName}
            </span>
          ) : (
            <span>
              {pageItem?.seller && truncate(pageItem.seller, 4, 4, 11)}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-2 pt-4">
          <h3 className="text-2xl">Traits</h3>
          <div className="flex flex-wrap gap-3 items-center ">
            {pageItem?.attributesList?.map((attribute, index) => (
              <div
                key={index}
                className="text-gray-200 bg-[#394b61] bg-opacity-40 p-2 rounded-xl flex w-fit "
              >
                {attribute}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-1 py-5">
          <h3 className="text-3xl">{pageItem?.name}</h3>
          <p className="text-sm max-w-3xl text-gray-500">
            {pageItem?.description}
          </p>
        </div>
        <ItemSellCard />
        {bids.length > 0 && (
          <div className="flex flex-col space-y-2 justify-center">
            {bids.map((bid, index) => (
              <BidCard bid={bid} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemInfo;
