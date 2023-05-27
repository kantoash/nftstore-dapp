import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { MdOutlineEdit } from "react-icons/md";
import useCreateAvatarModal from "../../../hooks/CreateUserModal";
import UserBackImg from "./UserBackImg";
import UserProfileImg from "./UserProfileImg";
import { useParams } from "react-router";

const UserInfo = () => {
  const { user, wallet } = useSelector((state: RootState) => state.counter);
  const { userAddress } = useParams();
  const createAvatarModal = useCreateAvatarModal();
  
  return (
    <div className="flex flex-col">
      <div className="h-[200px] relative ">
        <UserBackImg imgUrl={user?.backImg} />
        <div className="absolute -bottom-10 left-4">
          <UserProfileImg imgUrl={user?.profileImg} hasBorder isLarge />
        </div>
      </div>

      <div className=" flex items-center justify-between pt-14 p-5 text-gray-600 space-x-4">
        <div>
          <h2 className="text-3xl">{user?.name || "name"}</h2>
          <div className="flex items-center space-x-3 text-xl pt-2">
            <p>@{user?.userName || "username"}</p>
          </div>
          <p className="text-sm">{user?.description || "user description"}</p>
        </div>
        {wallet.toLowerCase() === userAddress?.toLowerCase() && (
          <div
            onClick={createAvatarModal.onOpen}
            className="border border-gray-400 rounded-full p-1"
          >
            <MdOutlineEdit size={25} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
