import React from 'react';

type UserImageProps = {
  user: { email: string; name: string; image?: string | null };
};
function UserImage({ user }: UserImageProps) {
  return (
    <div className="useraccountinfo">
      <div className="userimage">
        {user.image ? (
          <img src={user.image} alt="" />
        ) : (
          <span aria-hidden="true">{user.name.slice(0, 1) || '🙂'}</span>
        )}
      </div>
      <div className="person">
        <strong>{user.name}</strong>
        <span className="useremail">{user.email}</span>
      </div>
    </div>
  );
}
export default UserImage;
