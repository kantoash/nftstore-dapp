import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useMintNftModal from "../../hooks/MintNftModal";
import { useNavigate } from "react-router";
import MenuOption from "./MenuOption";

const MenuModal = () => {
  const { wallet } = useSelector((state: RootState) => state.counter);
  const createNftModal = useMintNftModal();
  const navigate = useNavigate();
  return (
    <motion.main
      initial={{
        x: 100,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      }}
      className="absolute top-0 left-0 w-full h-full z-50 "
    >
      <div className="bg-[#394b61] z-50 w-3/4 md:w-3/5 lg:w-2/5 h-3/5  flex flex-col items-center space-y-5 justify-center mx-auto rounded-3xl mt-20 relative overflow-hidden">
        <div>
          <MenuOption title="Home" />
        </div>
        <div onClick={createNftModal.onOpen}>
          <MenuOption title="Mint Nft" />
        </div>
        <div onClick={() => navigate(`/sellNft`)}>
          <MenuOption title="Sell Nft" />
        </div>
        {wallet && (
          <div onClick={() => navigate(`/user/${wallet}/Collected`)}>
            <MenuOption title="Profile" />
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default MenuModal;
