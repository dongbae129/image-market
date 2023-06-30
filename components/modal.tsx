import { downloadImage } from '@libs/client/downloadImage';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { UseMutateFunction } from 'react-query';
interface ModalProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  deleteMutation?: UseMutateFunction<any, unknown, void, unknown>;
  modalUse: 'delete' | 'paidDown';
  productId?: string;
}
const modalText = {
  delete: {
    header: '정말 삭제하시겠어요?',
    main: '삭제 후에는 실행을 취소할수 없습니다!',
    btn: '삭제'
  },
  paidDown: {
    header: '해당 이미지를 다운로드 하시겠습니까?',
    main: '해당 이미지는 1코인 또는 쿠폰 1장이 필요합니다',
    btn: '쿠폰사용'
  }
};
const Modal = ({
  modalOpen,
  setModalOpen,
  deleteMutation,
  modalUse,
  productId
}: ModalProps) => {
  const onClickClose = () => {
    setModalOpen((prev) => !prev);
  };

  const onClickOverDelete = (e: MouseEvent<HTMLDivElement>) => {
    const evTarget = e.target as HTMLDivElement;
    if (evTarget.classList.contains('modal-overlay')) {
      setModalOpen((prev) => !prev);
    }
  };
  const onClickDelOrCouponDown = () => {
    if (modalUse === 'paidDown' && productId) {
      downloadImage({ productId, setState: setModalOpen });
    } else {
      if (deleteMutation) deleteMutation();
    }
  };

  // const extractFilenameFromContentDisposition = (
  //   contentDisposition: string
  // ) => {
  //   const filenameRegex = /filename=[\w.-]+/;
  //   const matches = contentDisposition.match(filenameRegex);

  //   let filename = '';
  //   if (matches) {
  //     filename = matches[0].split('=')[1];
  //   }

  //   return filename;
  // };

  // const downloadImage = async () => {
  //   const response = await axios(
  //     `/api/product/download?productId=${productId}&imgAuth=${true}`,
  //     {
  //       responseType: 'blob'
  //     }
  //   );

  //   const contentDisposition = response.headers['content-disposition'];

  //   const fileName = extractFilenameFromContentDisposition(contentDisposition);

  //   const url = URL.createObjectURL(response.data);

  //   const link = document.createElement('a');
  //   // const fileName = prompt('enter the file name');
  //   link.href = url;
  //   link.download = fileName;

  //   link.click();

  //   URL.revokeObjectURL(url);
  //   setModalOpen((prev) => !prev);
  // };

  useEffect(() => {
    const keyDeleteModal = (e: KeyboardEvent) => {
      if (modalOpen && e.key === 'Escape') setModalOpen((prev) => !prev);
    };
    document.addEventListener('keyup', keyDeleteModal);
    return () => {
      document.removeEventListener('keyup', keyDeleteModal);
    };
  }, []);

  return (
    <div className="modalwrap">
      <div id="modal" className="modal-overlay" onClick={onClickOverDelete}>
        <div className="modal-window">
          <div className="close-area" onClick={onClickClose}>
            X
          </div>
          <div className="content">
            <div className="content_ask">
              <h1>{modalText[modalUse].header}</h1>
            </div>
            <div>
              <h3>{modalText[modalUse].main}</h3>
            </div>
            <div>
              <div className="content_btnwrap">
                <div>
                  <button className="content_btn_cancel" onClick={onClickClose}>
                    <div className="content_btn">
                      {modalUse === 'delete' ? '취소' : '코인사용'}
                    </div>
                  </button>
                </div>
                <div>
                  <button
                    className="content_btn_delete"
                    onClick={onClickDelOrCouponDown}
                  >
                    <div className="content_btn">{modalText[modalUse].btn}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        #modal.modal-overlay {
          width: 100%;
          height: 100%;
          z-index: 999;
          position: absolute;
          left: 0;
          top: 0;
          display: ${modalOpen ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.75);
        }
        #modal .modal-window {
          background: #fff;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 10px;
          top: -100px;
          padding: 10px;
        }

        #modal .close-area {
          float: right;
          padding-right: 10px;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
        }

        #modal .content {
          padding: 0px 10px;
          font-weight: bold;
        }
        .content > div {
          padding: 24px;
        }
        .content_btnwrap {
          display: flex;
          justify-content: center;

          > div {
            padding-left: 4px;
            padding-right: 4px;
          }
          button {
            border-radius: 10px;
            border: 0;
            cursor: pointer;

            :hover {
              filter: brightness(0.7);
            }
          }
          .content_btn_cancel {
            background-color: rgb(239, 239, 239);
          }
          .content_btn_delete {
            background-color: red;
            color: #fff;
          }
        }
        .content_btn {
          padding: 8px;
          font-weight: 600;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Modal;
