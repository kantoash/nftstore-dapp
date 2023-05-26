import { useEffect } from "react";
import Hero from "../components/Hero";
import { getAvailableMarketItems } from "../services/ssrblockchain";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../store/storeSlices";
import { RootState } from "../store";
import ItemCard from "../components/input/nft/ItemCard";
import Header from "../components/header/Header";

const Home = () => {
  const { items } = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = async () => {
      const avaliableItems = await getAvailableMarketItems();
      dispatch(setItems(avaliableItems));
    };
    fetch();
  }, [items]);
  
  
  
  return (
    <div>
      <div className="bg-gradient-to-b from-gray-600 to-gray-100 ">
        <Header />
        <Hero />
      </div>
      <div className="mt-10 px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-12 place-items-center w-full xl:max-w-7xl mx-auto">
        {items && items.map((item) => <ItemCard item={item} key={item?.id} />)}
      </div>
    </div>
  );
};

export default Home;
