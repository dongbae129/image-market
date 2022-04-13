import type { NextPage } from "next";
import styles from "@styles/profileDetail.module.scss";
const userProfile: NextPage = () => {
  return (
    <div>
      <div className={styles.profilewrap}>
        <div className={styles.profileuser}>
          <div>
            <img src="" alt="" />
          </div>
          <div>
            <span>Name</span>
            <h3>이름</h3>
          </div>
          <div>
            <span>ID</span>
            <h4>아이디</h4>
          </div>
        </div>
        <div className={styles.imgtags}>
          <h3>사진태그</h3>
          <span>#11</span>
          <span>#22</span>
          <span>#33</span>
        </div>
      </div>
    </div>
  );
};

export default userProfile;
