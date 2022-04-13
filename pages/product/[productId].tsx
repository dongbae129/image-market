import type { NextPage } from "next";
import styles from "@styles/ProductDetail.module.scss";
const ProductDetail: NextPage = () => {
  return (
    <div className={styles.productwrap}>
      <div className={styles.productimg}>이미지</div>
      <div className={styles.productinfo}>
        <div className={styles.productuser}>
          <span>
            <img src="" alt="" />
          </span>
          <span>username</span>
          <button>팔로우</button>
        </div>
        <div>
          <button>다운로드</button>
          <ul>
            <li>화소 free, pay</li>
            <li>화소 free, pay</li>
            <li>화소 free, pay</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
