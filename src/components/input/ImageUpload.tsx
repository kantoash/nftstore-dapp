import axios from "axios";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

interface ImageUploadProps {
  label: string;
  onChange: (base64: string) => void;
  value?: string;
  disabled: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onChange,
  disabled,
}) => {
  const [preview, setPreview] = useState("");
  const key = import.meta.env.VITE_PINATA_API_KEY;
  const secret = import.meta.env.VITE_PINATA_API_SECRET;

  const changeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const imageData = e.target.files![0];
    setPreview(URL.createObjectURL(imageData));
    try {
      const formData = new FormData();
      formData.append("file", imageData);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      });

      const imageURL = `ipfs://${response.data.IpfsHash}`;
      onChange(imageURL);
      console.log("image uploaded", imageURL);
    } catch (error) {
      console.log("error image upload", error);
    }
  };

  const ImageRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="w-full text-white text-center overflow-hidden rounded-xl ">
      {preview ? (
        <div className="flex h-[150px] w-full items-center justify-center relative  ">
          <img
            src={preview}
            className="h-full w-full object-cover"
            alt="Uploaded image"
          />
          <div
            onClick={ImageRemove}
            className="absolute top-2 right-2 text-gray-600 border border-gray-600 rounded-xl p-1 cursor-pointer"
          >
            <AiOutlineDelete size={20} />
          </div>
        </div>
      ) : (
        <div
          className="flex flex-row
         items-center justify-center  bg-[#394b61] bg-opacity-60 rounded-xl"
        >
          <input
            disabled={disabled}
            type="file"
            accept="image/png, image/gif, image/jpeg, image/webp"
            className="ImgInput"
            onChange={changeImage}
            required
          />
          <label className=" whitespace-nowrap flex-1 text-center ">
            {label}
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
