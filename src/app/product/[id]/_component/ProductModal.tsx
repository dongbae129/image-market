import Modal from '@app/_components/modal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';
import { useMutation } from '@tanstack/react-query';

type ProductModalProps = {
  productId: string | string[] | undefined;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};
function ProductModal({
  productId,
  modalOpen,
  setModalOpen
}: ProductModalProps) {
  const router = useRouter();
  const deleteSend = () =>
    axios.delete(`/api/product/${productId}`).then((res) => res.data);
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteSend,
    onSuccess: (res) => {
      console.log(res, 'deleted success');
      router.replace('/');
    },
    onError: (res) => {
      console.error(res, 'deleted fail');
      const message = axios.isAxiosError<{ message?: string }>(res)
        ? res.response?.data?.message
        : undefined;
      window.alert(
        message ?? '상품 판매 중단에 실패했습니다. 다시 시도해주세요.'
      );
      setModalOpen(false);
    }
  });
  return (
    <>
      {modalOpen && (
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          deleteMutation={deleteMutation}
          modalUse="productDelete"
        />
      )}
    </>
  );
}

export default ProductModal;
