import { useState, useEffect, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ImageUpload from "../components/input/ImageUpload";
import { userCreate, userUpdate } from "../services/cssblockchain";
import useCreateUserModal from "../hooks/CreateUserModal";

const CreateUser = () => {
  const { wallet, user } = useSelector((state: RootState) => state.counter);
  const { isOpen, onClose } = useCreateUserModal()
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [backImage, setBackImage] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  

  const createUserFunc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wallet) {
      toast("Metamask wallet Not created");
    }
    setIsLoading(true);

    if (!name || !username || !description || !backImage || !profileUrl) {
      return;
    }
    
      if (!user?.isUserCreate) {
        await userCreate(name, username, description, backImage, profileUrl).then(() => {
          toast('User Create Success')
          handleClose();
        }).catch(() => {
          toast('User Create Error')
        })
      } else {
        const userId = user.userId;
        await userUpdate(userId, name, username, description, backImage, profileUrl).then(() => {
          toast('User Update Success')
          handleClose();
        }).catch(() => {
          toast('User Update Error')
        })
      }
    
   setIsLoading(false)
  };


  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto scrollbar-none fixed z-50 inset-0 bg-black bg-opacity-50  ">
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
          <div className="flex flex-row justify-between items-center text-xl text-gray-700">
            <p className="font-semibold ">{!user?.isUserCreate ? "Create User" : "Update User"}</p>
            <button onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
          <form
            onSubmit={createUserFunc}
            className="flex flex-col space-y-3 pt-8"
          >
            {/* name */}
            <div
              className="flex flex-row justify-between items-center
           rounded-xl mt-5"
            >
              <input
                className="createInput"
                type="text"
                name="title"
                placeholder="Title"
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
                required
              />
            </div>
            <div
              className="flex flex-row justify-between items-center
           rounded-xl mt-5"
            >
              <input
                className="createInput"
                type="text"
                name="username"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
                value={username}
                disabled={isLoading}
                required
              />
            </div>
            {/* username */}

            <ImageUpload
              label="Upload Background Image"
              value={backImage}
              onChange={(val) => setBackImage(val)}
              disabled={isLoading}
            />
            <ImageUpload
              label="Upload Profile Image"
              value={profileUrl}
              onChange={(val) => setProfileUrl(val)}
              disabled={isLoading}
            />

            {/* description */}
            <div className="flex flex-row justify-between items-center rounded-xl mt-5">
              <textarea
                className="createInput  h-28 resize-none scrollbar-none "
                name="description"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                disabled={isLoading}
                required
              ></textarea>
            </div>
            <button type="submit" className="MintNowBtn">
              {!user?.isUserCreate ? "Create User" : "Update User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;