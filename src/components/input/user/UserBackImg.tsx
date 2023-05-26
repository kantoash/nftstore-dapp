import React from 'react'


interface AvatarImgProps {
    imgUrl?: string
}

const UserBackImg: React.FC<AvatarImgProps> = ({
    imgUrl
}) => {
    return (
        <>
            {imgUrl ? (
            <img 
                 src={`https://gateway.pinata.cloud/ipfs//${imgUrl.substring(
                  7
                )}`}
                alt="avatar_image"
                className='h-[200px] w-full object-cover'
              />
            ) : (
                <img src={'/UserBackground.jpg'} alt="avatar_image"
                className='h-[200px] w-full object-cover'  />
            )}
        </>
    )
}

export default UserBackImg