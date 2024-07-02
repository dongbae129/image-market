import Image from 'next/image';
import React from 'react';

type UserImageProps = {
  user: {
    email: string;
    name: string;
  };
};
function UserImage({ user }: UserImageProps) {
  return (
    <>
      <div className="useraccountinfo">
        <div className="userimage">
          <Image
            src="/localimages/emptyuser.png"
            layout="fill"
            alt="userImage"
          />
        </div>
        <div className="useremail">{user.email}</div>
      </div>
      <style jsx>{`
        .useraccountinfo {
          display: flex;
          width: 80%;
          word-break: break-all;
        }
        .userimage {
          width: 50px;
          min-width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 5px;
          overflow: hidden;
          position: relative;
        }
        .useremail {
          margin-right: 16px;
          padding: 5px;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default UserImage;
