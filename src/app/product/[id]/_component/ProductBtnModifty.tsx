import SvgIcon from '@app/_components/svgIcon';
import { Product } from '@prisma/client';
import Link from 'next/link';
import React, { useState } from 'react';
import { UserHashtagHit } from '../page';
import SvgData from '@/json/data.json';

type ProductBtnModiftyProps = {
  product: Product & UserHashtagHit;
  onClickDelete: () => void;
  onClickDown: () => void;
  productId: string | string[] | undefined;
  watchAuth: boolean | undefined;
};
function ProductBtnModifty({
  product,
  onClickDelete,
  onClickDown,
  productId,
  watchAuth
}: ProductBtnModiftyProps) {
  const [modifyOpen, setModifyOpen] = useState(false);

  const onClickModify = () => {
    setModifyOpen((prev) => !prev);
  };

  const { modify } = SvgData.SVG;
  return (
    <>
      <div className="btnwithmodify">
        <div>
          <button>
            {product.auth ? (
              <div onClick={onClickDown}>저장</div>
            ) : (
              <a
                href={`/api/product/download?productId=${productId}&imgAuth=${watchAuth}`}
                download
              >
                저장
              </a>
            )}
          </button>
        </div>

        <div className="svgwrap_div" onClick={onClickModify}>
          {/* <SlOptionsVertical /> */}
          <SvgIcon svgInfo={modify} viewBox="0 0 1040 1040" />
        </div>

        <div className={`modifypost ${modifyOpen ? 'open' : ''}`}>
          <div className="modifypost_mar">
            <div className="modifypost_pad">
              <Link href={`/product/${productId}/setting`}>수정하기</Link>
            </div>
            <div className="modifypost_pad" onClick={onClickDelete}>
              <p>삭제하기</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductBtnModifty;
