import { useState, useEffect, useCallback } from "react";
import useMintNftModal from "../hooks/MintNftModal";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { MintNftFunc, walletConnect } from "../services/cssblockchain";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ImageUpload from "../components/input/ImageUpload";
import AttributesCard from "../components/input/AttributesCard";

const CreateNft = () => {
  const { wallet } = useSelector((state: RootState) => state.counter);
  const { isOpen, onClose } = useMintNftModal();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [attributesList, setAttributesList] = useState<string[]>();
  const [showModal, setShowModal] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const mintNft = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (!wallet) {
     walletConnect()
    }

    if (!name || !description || !imageUrl || !attributesList) {
      return;
    }
      
    await MintNftFunc(name, description, imageUrl, attributesList)
      .then(() => {
        toast("Nft Created");
        handleClose();
      })
      .catch(() => {
        toast("Nft Created Error");
      });
    setIsLoading(false);
  };
  

  return (
    <div
      className="flex justify-center items-center overflow-x-hidden overflow-y-auto 
    scrollbar-none fixed z-50 inset-0 bg-black bg-opacity-50  "
    >
      <div
        className="w-full   md:w-4/6
          lg:w-3/6
          xl:w-2/5
          mt-10
          mx-auto 
          h-full 
          md:h-auto"
      >
        <div
          className={`translate duration-300 h-full p-5 bg-gray-400 ${
            showModal ? "translate-y-0" : "translate-y-full"
          } ${
            showModal ? "opacity-100" : "opacity-0"
          } rounded-t-xl sm:rounded-xl`}
        >
          <div
            className="flex flex-row justify-between items-center text-xl 
          text-gray-700"
          >
            <p className="font-semibold ">Add NFT</p>
            <button onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
          <form
            onSubmit={mintNft}
            className="flex flex-col justify-center pt-8 space-y-3"
          >
            <ImageUpload
              label="Nft Image"
              value={imageUrl}
              onChange={(val) => setImageUrl(val)}
              disabled={isLoading}
            />
            <div
              className="flex flex-row justify-between items-center
           rounded-xl "
            >
              <input
                className="createInput"
                type="text"
                name="title"
                placeholder="Title"
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-row justify-between items-center rounded-xl ">
              <textarea
                className="createInput  h-28 resize-none scrollbar-none "
                name="description"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                disabled={isLoading}
                required
              ></textarea>
            </div>

            <AttributesCard
              attributesList={attributesList}
              setAttributesList={(val) => setAttributesList(val)}
              disabled={isLoading}
            />
            <button type="submit" className="MintNowBtn">
              Mint Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNft;
