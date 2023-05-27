import { useState, useEffect, useCallback, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import useCartModal from "../hooks/CartModal";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { buyAll, walletConnect } from "../services/cssblockchain";

const ShopCart = () => {
  const { isOpen, onClose } = useCartModal();
  const [showModal, setShowModal] = useState(isOpen);
  const [products, setProducts] = useState<any[]>();
  const navigate = useNavigate();
  const { cartItems, wallet } = useSelector((state: RootState) => state.counter);
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (cartItems.length > 0) {
      setProducts(cartItems);
    }else{
      setProducts(JSON.parse(ls?.getItem("cart")!));
    }
  }, []);

  const totalEth = useMemo(() => {
    if (!products) {
      return;
    }
    let totalEth = 0;
    for (let index = 0; index < products.length; index++) {
      totalEth += Number(products[index]?.price);
    }
    return `${totalEth}`;
  },[products])

  const BuyAll = async () => {
    if (!wallet) {
     walletConnect()
    }
    if (!totalEth || !products) {
      return;
    }
    const productIds = [];
    for (let index = 0; index < products.length; index++) {
      productIds.push(products[index].id);
    }
    
    await buyAll(productIds, totalEth).then(() => {
      toast('Buy All Item Success');
      handleClose();
    }).catch(() => {
      toast('Buy All Item Error');
    })
  }

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

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
            <p className="font-semibold ">Shop Cart</p>
            <button onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-col space-y-5 justify-center mt-8 text-gray-300">
            <div className="flex flex-col space-y-3 justify-center mt-8">
              {products &&
                products.map((product) => (
                  <div className="flex items-center justify-between space-x-3 ">
                    <div className="flex items-center space-x-3">
                    <div
                      onClick={() => navigate(`/itemPage/${product!.id}`)}
                      className="h-[100px] w-[100px] shrink-0"
                    >
                      <img
                        src={`https://gateway.pinata.cloud/ipfs//${product?.image?.substring(
                          7
                        )}`}
                        alt="nft_image"
                        className="h-full w-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl">{product?.name}</h3>
                      <p className="text-xs max-w-sm">{product?.description}</p>
                    </div>
                    </div>
                    <div className="shrink-0 text-sm space-y-3">
                      {/* price */}
                      <div className="bg-gray-500 p-1 rounded-xl text-center">
                        {product?.price} ETH
                      </div>
                      <div className="bg-gray-500 p-1 rounded-xl text-center">
                        {product?.isAuction ? (
                          <div>Auction</div>
                        ) : (
                          <div>Fixed</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex text-xl space-x-3 items-center justify-center">
              <h2>Total Eth </h2>
                <span>{totalEth}</span>
            </div>
            <button onClick={BuyAll} className="MintNowBtn">
              Buy Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
