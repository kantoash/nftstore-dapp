import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IconType } from "react-icons";
import { AiOutlineUser } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import { MdOutlineCreate } from "react-icons/md";
import { useNavigate } from "react-router";
import useMintNftModal from "../../hooks/MintNftModal";

interface MenuInputProps {
  Icon?: IconType;
  title: string;
}

const MenuInput: React.FC<MenuInputProps> = ({ Icon, title }) => {
  return (
    <div className="text-base md:text-lg font-semibold flex items-center space-x-3 text-gray-600">
      <div>
        {Icon && <Icon size={20} />}
      </div>
      <h1>{title}</h1>
    </div>
  );
};

const Menu = () => {
  const { wallet } = useSelector((state: RootState) => state.counter);
  const navigate = useNavigate();
  const MintNftModal = useMintNftModal();

  return (
    <div className="flex flex-col gap-3 ">
      <div onClick={() => navigate("/")}>
        <MenuInput Icon={AiOutlineUser} title="Home" />
      </div>
      <div onClick={MintNftModal.onOpen}>
        <MenuInput Icon={MdOutlineCreate} title="Nft" />
      </div>
      <div onClick={() => navigate("/SellNft")}>
        <MenuInput Icon={BsPlusCircle} title="Sell Nft" />
      </div>

      <span className="w-full p-[1px] bg-gray-300 rounded-lg"></span>
      {/* profile */}
      {wallet && 
      (
        <div onClick={() => navigate(`/User/${wallet}/Collected`)}>
        <MenuInput Icon={AiOutlineUser} title="Profile" />
        </div>
      )}
    </div>
  );
};

export default Menu;
