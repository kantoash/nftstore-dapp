import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { truncate, walletConnect } from "../../services/cssblockchain";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router";
import useCartModal from "../../hooks/CartModal";
import MenuModal from "./MenuModal";

const Header = () => {
  const { wallet } = useSelector((state: RootState) => state.counter);
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  const cartModal = useCartModal()
  const navigate = useNavigate();

  const MenuToggle = () => {
    setIsMenuOpen((val) => !val);
  };

  return (
    <nav className="bg-[#303f51] bg-opacity-70 flex items-center py-3 px-3 md:px-5 space-x-3 justify-between rounded-xl shadow-lg shadow-gray-300 z-10 ">
      <div onClick={() => navigate('/')} className="h-12 cursor-pointer ">
        <img src={"/logo.jpg"} alt="logo_image" className="h-full rounded-xl" />
      </div>
   

      <div className="flex items-center space-x-3">
        <div
          className="bg-gray-300 bg-opacity-50 rounded-xl px-3 py-2
     text-white  flex items-center space-x-2 cursor-pointer"
        >
          <div>
            {wallet ? (
              <button className="">{truncate(wallet, 4, 4, 11)}</button>
            ) : (
              <button className="" onClick={walletConnect}>
                Connect Wallet
              </button>
            )}
          </div>

          <div
            onClick={MenuToggle}
            className="border-l-[1px] border-white pl-2 cursor-pointer"
          >
            <GiHamburgerMenu size={20} />
            {isMenuOpen && <MenuModal />}
          </div>
        </div>
     
        <div onClick={cartModal.onOpen} className="bg-gray-300 bg-opacity-50 rounded-xl p-3 
        text-white cursor-pointer ">
          <AiOutlineShoppingCart size={20}/>
        </div>
      </div>
    </nav>
  );
};

export default Header;
