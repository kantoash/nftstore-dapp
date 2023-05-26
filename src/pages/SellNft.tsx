import { useEffect, useState } from "react";
import { getNftOwned } from "../services/ssrblockchain";
import { Nft } from "../typings";
import SellSelectedNft from "../components/input/nft/SellSelectedNft";
import NftRow from "../components/input/nft/NftRow";
import { useDispatch, useSelector } from "react-redux";
import { setNfts } from "../store/storeSlices";
import { RootState } from "../store";
import Header from "../components/header/Header";

const SellNft = () => {
  const [selectNft, setSelectNft] = useState<Nft>();
  const { nfts, wallet } = useSelector((state: RootState) => state.counter)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      if (!wallet) {
        return;
      }
      const NftOwned = await getNftOwned();      
      dispatch(setNfts(NftOwned))
    };
    fetch();
  }, [nfts]);


  return (
    <div>
      <Header />
      <div className=" mt-20 m-10 flex flex-col justify-center space-y-10 overflow-hidden">
        {/* nft row */}
        <NftRow selectNft={selectNft} setSelectNft={setSelectNft} />
        {/* fixed, auction */}
        <SellSelectedNft
          selectNft={selectNft} setSelectNft={setSelectNft}
        />
      </div>
    </div>
  );
};

export default SellNft;
