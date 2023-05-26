import { create } from 'zustand'

interface MintNftModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: ()=> void;
}

const useMintNftModal = create<MintNftModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))

export default useMintNftModal;