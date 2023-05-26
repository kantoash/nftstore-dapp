import { Item } from "../../../typings";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router";
import { setAddCart } from "../../../store/storeSlices";
import { useDispatch } from "react-redux";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  return (
    <div className="group relative text-xl text-gray-300">
      <div className="aspect-square flex flex-col  
      cursor-pointer h-[300px] w-[300px] overflow-hidden 
      rounded-xl bg-[#394b61] ">
        <div
          onClick={() => navigate(`/itemPage/${item!.id}`)}
          className="h-[250px] shrink-0"
        >
          <img
            src={`https://gateway.pinata.cloud/ipfs//${item?.image.substring(
              7
            )}`}
            alt="nft_image"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="px-5 my-auto">
          <h3>{item?.name}</h3>
        </div>
        <div className="absolute bottom-8 group-hover:translate-y-1 group-hover:bottom-0 opacity-0 group-hover:opacity-100  transition-transform duration-300 ease-in-out z-50">
          <div className="flex items-center justify-between bg-[#303f51] rounded-b-xl h-[50px] w-[300px]">
            <div className="flex flex-1 items-center justify-center">
              {item?.isAuction ? <h3>Bid Now</h3> : <h3> Buy Now</h3>}
            </div>
            <div
              onClick={() => dispatch(setAddCart(item))}
              className={`border-l-[1px] border-gray-300 px-4`}
            >
              <AiOutlineShoppingCart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
