import { useState } from "react";
import { Nft } from "../../../typings";
import { NftSellAuction, NftSellFixed, truncate, walletConnect } from "../../../services/cssblockchain";
import { AiOutlineUser } from "react-icons/ai";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface SellSelectedNftProps {
  selectNft?: Nft;
  setSelectNft: (val: Nft) => void;
}

const SellSelectedNft: React.FC<SellSelectedNftProps> = ({ selectNft, setSelectNft }) => {
  const [isFixed, setIsFixed] = useState(true);
  const [price, setPrice] = useState("");
  const [expires, setExpiresAt] = useState("");
  const { wallet } = useSelector((state: RootState) => state.counter)

  const SellNftFunc = async () => {
    if (!wallet) {
     walletConnect()
      return;
    }

    if (!selectNft || !price) {
      return;
    }
    
    const tokenId = Number(selectNft.tokenId);
    
      await NftSellFixed(tokenId, price).then(() => {
        toast('Nft Sell Success');
        setPrice('');
        setSelectNft(null)
      }).catch(() => {
        toast('Nft Sell Error')
      })
  };

  const AuctionNftFunc = async () => {    
    if (!wallet) {
      walletConnect()
      return;
    }

    if (!selectNft || !price || !expires) {
      return;
    }
    
    try { 
      const tokenId = Number(selectNft.tokenId);
      await NftSellAuction(tokenId, price, expires).then(() => {
        toast('Nft Auction Success');
        setPrice('');
        setExpiresAt('');
        setSelectNft(null)
      }).catch(() => {
        toast('Nft Auction Error')
      })
    } catch (error) {
      toast('Sell Nft error')
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="flex flex-col items-center justify-center space-y-3">
        <h3 className="text-3xl text-gray-600">Sell Nft</h3>
        <div className="flex flex-row items-center justify-center space-x-8 text-lg">
          <div
            onClick={() => setIsFixed(true)}
            className={` border-b-2 ${
              isFixed ? "border-gray-400" : "border-transparent"
            } cursor-pointer`}
          >
            Fixed
          </div>
          <div
            onClick={() => setIsFixed(false)}
            className={` border-b-2 ${
              !isFixed ? "border-gray-400" : "border-transparent"
            } cursor-pointer `}
          >
            Auction
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-8">
        <div className="order-last md:order-first">
          <div
            className="
            bg-white 
              rounded-xl 
              border-2
              flex flex-col 
            border-neutral-300 
              overflow-hidden
              w-[350px]
              h-auto
              space-y-5
              p-4
            "
          >
            <div className="text-3xl">
              {isFixed ? <h3>Fixed Sell</h3> : <h3>Auction Sell</h3>}
            </div>

            <div>
              <input
                type="text"
                name="price"
                placeholder="Nft Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="createInput"
                required
              />
            </div>
            {!isFixed && (
              <div>
                <input
                  type="datetime-local"
                  name="ExpiresAt"
                  placeholder="Auction Expire Date"
                  value={expires}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="createInput"
                  required
                />
              </div>
            )}

            {isFixed ? (
              <button onClick={SellNftFunc} className="MintNowBtn">
                Sell Nft
              </button>
            ) : (
              <button onClick={AuctionNftFunc} className="MintNowBtn">
                Auction Nft
              </button>
            )}
          </div>
        </div>
        <div>
          {selectNft && (
            <div className="aspect-square h-[450px] w-[300px] flex flex-col justify-between cursor-pointer overflow-hidden rounded-xl bg-gray-500">
              <div className="h-[300px] shrink-0">
                <img
                  src={`https://gateway.pinata.cloud/ipfs//${selectNft?.image.substring(
                    7
                  )}`}
                  alt="nft_image"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-2 bg-[#394b61] h-full">
                <div className="text-white space-y-2">
                  <h3 className="text-xl font-semibold">{selectNft.name}</h3>
                  <p className="text-sm">
                    {truncate(selectNft.description, 100, 0, 100)}
                  </p>
                </div>
                {/* owner info */}
                <div className="flex justify-between items-center pt-4 text-white">
                  <AiOutlineUser size={20} />
                  <p> {truncate(selectNft.owner, 4, 4, 11)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellSelectedNft;