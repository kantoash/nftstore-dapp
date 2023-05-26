interface AvatarProps {
  imgUrl?: string | null | undefined;
  isLarge?: boolean;
  hasBorder?: boolean;
}

const UserProfileImg: React.FC<AvatarProps> = ({
  imgUrl,
  isLarge,
  hasBorder,
}) => {
  
  return (
    <div
      className={`${hasBorder && "border-[2px] border-neutral-600 "}     ${
        isLarge ? "h-24" : "h-8"
      }
  ${isLarge ? "w-24" : "w-8"} rounded-full overflow-hidden relative `}
    >
      {imgUrl ? (
        <img
          src={`https://gateway.pinata.cloud/ipfs//${imgUrl.substring(7)}`}
          alt="avatar_image"
          className="object-cover"
        />
      ) : (
        <img
          src={"/placeholder.jpg"}
          alt="avatar_image"
          className="object-cover"
        />
      )}
    </div>
  );
};

export default UserProfileImg;
