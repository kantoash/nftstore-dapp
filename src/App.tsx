import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { isWallectConnected } from "./services/cssblockchain";
import { Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Home from "./pages/Home";
import SellNft from "./pages/SellNft";
import CreateNft from "./modal/CreateNft";
import useMintNftModal from "./hooks/MintNftModal";
import useCreateAvatarModal from "./hooks/CreateUserModal";
import CreateUser from "./modal/CreateUser";
import UserPage from "./pages/UserPage";
import NftPage from "./pages/NftPage";
import useCartModal from "./hooks/CartModal";
import ShopCart from "./modal/ShopCart";

function App() {
  const { wallet, cartItems } = useSelector((state: RootState) => state.counter);
  useEffect(() => {
    isWallectConnected();
  }, [wallet]);
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  useEffect(() => {
    if (cartItems[0]) {
      ls?.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  return (
    <BrowserRouter>
      <div>
        {useMintNftModal().isOpen && <CreateNft />}
        {useCreateAvatarModal().isOpen && <CreateUser />}
        {useCartModal().isOpen && <ShopCart />}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SellNft" element={<SellNft />} />
        <Route path="/itemPage/:itemId" element={<NftPage />} />
        <Route path="/User/:userAddress/:action" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
