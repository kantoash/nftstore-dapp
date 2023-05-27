import React from "react";
import useMintNftModal from "../../../hooks/MintNftModal";
import { Nft } from "../../../typings";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { truncate, walletConnect } from "../../../services/cssblockchain";
import { AiOutlineUser } from "react-icons/ai";

interface NftRowProps {
  selectNft?: Nft;
  setSelectNft: (val: Nft) => void;
}

const NftRow: React.FC<NftRowProps> = ({ setSelectNft }) => {
  const MintModal = useMintNftModal();
  const { nfts, wallet } = useSelector((state: RootState) => state.counter);
  return (
    <div
      className="flex flex-row items-center overflow-x-scroll h-[500px] gap-5 px-5
    "
    >
      {nfts.length ? (
        nfts.map((nft, index) => (
          <div
            onClick={() => setSelectNft(nft)}
            key={index}
            className="aspect-square h-full w-[300px] shrink-0 flex flex-col 
          justify-between cursor-pointer overflow-hidden rounded-xl"
          >
            <div className="h-[300px] shrink-0">
              <img
                src={`https://gateway.pinata.cloud/ipfs//${nft?.image.substring(
                  7
                )}`}
                alt="nft_image"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between p-2 bg-[#394b61] h-full">
              <div className="text-white space-y-1">
                <h3 className="text-xl font-semibold">{nft?.name}</h3>
                <p className="text-sm">
                  {nft?.description && truncate(nft.description, 100, 0, 100)}
                </p>
              </div>
              {/* owner info */}
              <div className="flex justify-between items-center pt-3 text-white">
                <AiOutlineUser size={20} />
                <p> {nft?.owner && truncate(nft.owner, 4, 4, 11)}</p>
              </div>
            </div>
          </div>
        ))
      ) : wallet ? (
        <div className="flex flex-col justify-center items-center gap-4 mx-auto">
          <h3 className="text-2xl">There Is No Nfts Mint Some</h3>
          <button className="ClickBtn" onClick={MintModal.onOpen}>
            Mint NFT
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4 mx-auto">
          <h3 className="text-2xl">Connect wallet</h3>
          <button className="ClickBtn" onClick={walletConnect}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default NftRow;
