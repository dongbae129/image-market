import SvgIcon from '@app/_components/svgIcon';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import SvgData from '@/json/data.json';
import { privateApi } from '@libs/client/axiosIntercepotr';

type ProductBtnModiftyProps = {
  onClickDelete: () => void;
  productId: string | string[] | undefined;
  productAuth: boolean;
  canManage: boolean;
  productVersionId?: number;
};
function ProductBtnModifty({
  onClickDelete,
  productId,
  productAuth,
  canManage,
  productVersionId
}: ProductBtnModiftyProps) {
  const [modifyOpen, setModifyOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const onClickModify = () => {
    setModifyOpen((prev) => !prev);
  };

  const downloadVersion = async (versionId?: number) => {
    if (!productId || Array.isArray(productId) || downloading) return;

    const suffix = versionId ? `?productVersionId=${versionId}` : '';
    const { data } = await privateApi.get<{ ok: boolean; url?: string }>(
      `/api/product/${productId}/download${suffix}`
    );
    if (!data.url) throw new Error('Download URL is missing');
    window.location.assign(data.url);
    setModifyOpen(false);
  };

  const handleDownload = async (paymentType?: 'COIN' | 'BONUS_COUPON') => {
    if (!productId || Array.isArray(productId) || downloading) return;

    setDownloading(true);
    try {
      if (!productAuth) {
        await downloadVersion();
        return;
      }

      if (!productVersionId) throw new Error('Pro version is not ready');
      if (!paymentType) {
        const { data } = await privateApi.get<{
          ok: boolean;
          owned: boolean;
        }>(
          `/api/product/${productId}/purchase?productVersionId=${productVersionId}`
        );
        if (data.owned) {
          await downloadVersion(productVersionId);
        } else {
          setPurchaseOpen(true);
        }
        return;
      }

      await privateApi.post(`/api/product/${productId}/purchase`, {
        productVersionId,
        paymentType,
        idempotencyKey: crypto.randomUUID()
      });
      setPurchaseOpen(false);
      await downloadVersion(productVersionId);
    } catch (error) {
      console.error('Image download failed:', error);
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      window.alert(
        message ?? '이미지 다운로드를 시작하지 못했습니다. 다시 시도해주세요.'
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
              onClick={() => void handleDownload()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  void handleDownload();
                }
              }}
            >
              {downloading
                ? '다운로드 준비 중...'
                : productAuth
                  ? 'Pro 원본 다운로드'
                  : '736px 이미지 다운로드'}
            </div>
            {canManage && (
              <>
                <div className="modifypost_pad">
                  <Link href={`/product/${productId}/setting`}>수정하기</Link>
                </div>
                <div className="modifypost_pad" onClick={onClickDelete}>
                  <p>삭제하기</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {purchaseOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPurchaseOpen(false);
          }}
        >
          <section
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-purchase-title"
          >
            <h2 id="pro-purchase-title" className="text-lg font-bold">
              Pro 원본 구매
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              코인 10개 또는 보너스 쿠폰 1장으로 구매할 수 있습니다. 구매 후에는
              이 버전을 추가 차감 없이 다시 다운로드할 수 있습니다.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                className="rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50"
                disabled={downloading}
                onClick={() => void handleDownload('COIN')}
              >
                코인 10개 사용
              </button>
              <button
                className="rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                disabled={downloading}
                onClick={() => void handleDownload('BONUS_COUPON')}
              >
                보너스 쿠폰 1장 사용
              </button>
              <button
                className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100"
                onClick={() => setPurchaseOpen(false)}
              >
                취소
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default ProductBtnModifty;
