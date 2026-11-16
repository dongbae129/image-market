import { UseMutateFunction } from '@tanstack/react-query';

import { Dispatch, MouseEvent, SetStateAction, useEffect } from 'react';

interface ModalProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  deleteMutation?: UseMutateFunction<unknown, unknown, void, unknown> | null;
  modalUse: 'delete' | 'productDelete';
}
const modalText = {
  delete: {
    header: '정말 삭제하시겠어요?',
    main: '삭제 후에는 실행을 취소할수 없습니다!',
    btn: '삭제'
  },
  productDelete: {
    header: '상품 판매를 중단할까요?',
    main: '상품이 공개 목록에서 내려갑니다. 기존 구매자는 구매한 Pro 버전을 계속 다시 받을 수 있습니다.',
    btn: '판매 중지'
  }
};
const Modal = ({
  modalOpen,
  setModalOpen,
  deleteMutation,
  modalUse
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
  useEffect(() => {
    const keyDeleteModal = (e: KeyboardEvent) => {
      if (modalOpen && e.key === 'Escape') setModalOpen((prev) => !prev);
    };
    document.addEventListener('keyup', keyDeleteModal);
    return () => {
      document.removeEventListener('keyup', keyDeleteModal);
    };
  }, [modalOpen, setModalOpen]);

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
                    <div className="content_btn">취소</div>
                  </button>
                </div>
                <div>
                  <button
                    className="content_btn_delete"
                    onClick={() => deleteMutation?.()}
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
