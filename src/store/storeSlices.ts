import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Bid, Item, Nft, UserType } from "../typings";


// Define a type for the slice state
interface CounterState {
  wallet: string;
  user: UserType;
  nfts: Nft[];
  items: Item[];
  cartItems: Item[];
  pageItem: Item;
  bids: Bid[];
}

// Define the initial state using that type
const initialState: CounterState = {
  wallet: "",
  user: null,
  nfts: [],
  cartItems: [],
  items: [],
  pageItem: null,
  bids: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<string>) => {
      state.wallet = action.payload;
    },
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setNfts: (state, action: PayloadAction<Nft[]>) => {
      state.nfts = action.payload;
    },
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    setPageItem: (state, action: PayloadAction<Item>) => {
      state.pageItem = action.payload;
    },
    setBids: (state, action: PayloadAction<Bid[]>) => {
      state.bids = action.payload;
    },
    setAddCart: (state, action: PayloadAction<Item>) => {
      const check = state.cartItems.some(
        (cartItem) => cartItem?.id === action.payload?.id
      );
      if (check) {
        state.cartItems = [
          ...state.cartItems.filter(
            (item) => item?.id !== action.payload?.id
          ),
        ];
      } else {
        state.cartItems = [...state.cartItems, action.payload]
      }
    },
    setCart: (state, action: PayloadAction<Item[] | []>) => {
      state.cartItems = action.payload;
    }
  },
});

export const {
  setWallet,
  setUser,
  setNfts,
  setItems,
  setPageItem,
  setBids,
  setAddCart,
  setCart
} = counterSlice.actions;

export default counterSlice.reducer;
