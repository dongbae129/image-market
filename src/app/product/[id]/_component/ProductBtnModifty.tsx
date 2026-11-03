import SvgIcon from '@app/_components/svgIcon';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import SvgData from '@/json/data.json';
import { privateApi } from '@libs/client/axiosIntercepotr';

type ProductBtnModiftyProps = {
  onClickDelete: () => void;
  productId: string | string[] | undefined;
};
function ProductBtnModifty({
  onClickDelete,
  productId
}: ProductBtnModiftyProps) {
  const [modifyOpen, setModifyOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const onClickModify = () => {
    setModifyOpen((prev) => !prev);
  };

  const handleDownload = async () => {
    if (!productId || Array.isArray(productId) || downloading) return;

    setDownloading(true);
    try {
      const { data } = await privateApi.get<{ ok: boolean; url?: string }>(
        `/api/product/${productId}/download`
      );
      if (!data.url) throw new Error('Download URL is missing');

      window.location.assign(data.url);
      setModifyOpen(false);
    } catch (error) {
      console.error('Image download failed:', error);
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      window.alert(
        message ??
          '이미지 다운로드를 시작하지 못했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setDownloading(false);
    }
  };

  const { modify } = SvgData.SVG;
  return (
    <>
      <div className="btnwithmodify">
        <div className="svgwrap_div" onClick={onClickModify}>
          {/* <SlOptionsVertical /> */}
          <div className="rotate-90">
            <SvgIcon svgInfo={modify} viewBox="0 0 1040 1040" />
          </div>
        </div>

        <div className={`modifypost ${modifyOpen ? 'open' : ''}`}>
          <div className="modifypost_mar">
            <div
              className="modifypost_pad"
              role="button"
              tabIndex={0}
              aria-disabled={downloading}
              onClick={handleDownload}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  void handleDownload();
                }
              }}
            >
              {downloading ? '다운로드 준비 중...' : '이미지 다운로드'}
            </div>
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
