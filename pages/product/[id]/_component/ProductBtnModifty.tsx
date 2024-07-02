import SvgIcon from '@components/svgIcon';
import { Product } from '@prisma/client';
import Link from 'next/link';
import React, { useState } from 'react';
import { UserHashtagHit } from '../index';
import SvgData from 'json/data.json';

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
      <style jsx>{`
        .btnwithmodify {
          display: flex;
        }
        .svgwrap_div {
          width: 40px;
          border-radius: 15px;
          margin-left: 15px;

          :hover {
            background-color: #e9ecef;
          }
        }
        .modifypost {
          visibility: hidden;
          position: absolute;
          width: 0;
          border: 1px solid #d5d5d5;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
            rgba(0, 0, 0, 0.23) 0px 3px 6px;
          border-radius: 4px;

          top: 60px;
          right: 0;

          white-space: nowrap;
          overflow: hidden;

          transition: all 0.5s;

          > a {
            display: block;
          }

          .modifypost_mar {
            margin: 8px;
          }
          .modifypost_pad {
            padding: 8px;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            &:hover {
              background-color: #e9e9e9;
            }
          }
        }
        .modifypost.open {
          background-color: white;
          visibility: visible;
          width: 163px;
        }
        button {
          border-radius: 24px;
          background-color: #e60023;
          color: white;
          border: 0;
          min-width: 60px;
          font-size: 16px;
          font-weight: bold;
          height: 100%;
        }
      `}</style>
    </>
  );
}

export default ProductBtnModifty;
