import { useNavigate } from "react-router";
import { useParams } from "react-router";

const UserActions = () => {
  const { userAddress } = useParams();
  const navigate = useNavigate();

  return (
    <div className="text-gray-800 text-lg flex items-center space-x-5 p-5">
      <div
        onClick={() => navigate(`/user/${userAddress}/Collected`)}
        className="cursor-pointer"
      >
        Collected
      </div>
      <div
        onClick={() => navigate(`/user/${userAddress}/Activity`)}
        className="cursor-pointer"
      >
        Activity
      </div>
    </div>
  );
};

export default UserActions;