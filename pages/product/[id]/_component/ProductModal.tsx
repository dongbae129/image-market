import Modal from '@components/modal';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import { useMutation } from 'react-query';

type ProductModalProps = {
  productId: string | string[] | undefined;
  modalOpen: boolean;
  paidOpen: boolean;
  setPaidDown: Dispatch<SetStateAction<boolean>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};
function ProductModal({
  productId,
  paidOpen,
  modalOpen,
  setModalOpen,
  setPaidDown
}: ProductModalProps) {
  const router = useRouter();
  const deleteSend = () =>
    axios.delete(`/api/product/${productId}`).then((res) => res.data);
  const { mutate: deleteMutation } = useMutation(deleteSend, {
    onSuccess: (res) => {
      console.log(res, 'deleted success');
      router.replace('/');
    },
    onError: (res) => {
      console.error(res, 'deleted fail');
    }
  });
  return (
    <>
      {modalOpen && (
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          deleteMutation={deleteMutation}
          modalUse="delete"
        />
      )}
      {paidOpen && (
        <Modal
          modalOpen={paidOpen}
          setModalOpen={setPaidDown}
          modalUse="paidDown"
        />
      )}
    </>
  );
}

export default ProductModal;
