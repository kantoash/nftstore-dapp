import { useEffect } from "react";
import { useParams } from "react-router";
import { getMarketItem, getMarketItemBid, getUser } from "../services/ssrblockchain";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setBids, setPageItem, setUser } from "../store/storeSlices";
import ItemInfo from "../components/itemPage/ItemInfo";
import Header from "../components/header/Header";


const NftPage = () => {
  const { itemId } = useParams();
  const { pageItem, user, bids } = useSelector((state: RootState) => state.counter)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (!itemId) {
        return;
      }
      const ItemId = Number(itemId);
      const PageItem = await getMarketItem(ItemId);    
      const User = await getUser(PageItem.seller);

      dispatch(setPageItem(PageItem));
      dispatch(setUser(User));

      if (PageItem.isAuction) {
        const Bids = await getMarketItemBid(ItemId);
        dispatch(setBids(Bids))
      }
    };
    fetch();
  }, [pageItem, user, bids]);
  
  return (
    <div>
      <Header />
      <ItemInfo/>
    </div>
  );
};

export default NftPage;
