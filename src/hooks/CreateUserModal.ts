import { create } from 'zustand'

interface CreateUserModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: ()=> void;
}

const useCreateUserModal = create<CreateUserModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))

export default useCreateUserModal;