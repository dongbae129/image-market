import type { NextPage } from 'next';
import { useMutation, useQuery } from 'react-query';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { useState } from 'react';
import UploadImage from '@components/uploadImage';
import { useRouter } from 'next/router';
import axios from 'axios';
import Modal from '@components/modal';
import { Board } from '@prisma/client';

interface BoardTag {
  boardTag: {
    hashtag: string;
  }[];
}
interface BoardDetail {
  ok: boolean;
  board: Board & BoardTag;
}
const BoardSetting: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const boardId = router.query.id;
  console.log(boardId);
  const { data } = useQuery<BoardDetail>(
    ['getBoard'],
    getFetch(`/api/board/${boardId}`),
    {
      enabled: !!boardId
    }
  );
  const deleteSend = () =>
    newAxios.delete(`/api/board/${boardId}`).then((res) => res.data);
  const { mutate: deleteMutation } = useMutation(deleteSend, {
    onSuccess: (res) => {
      console.log(res, 'deleted success');
      router.replace('/board');
    },
    onError: (res) => {
      console.error(res, 'deleted fail');
      setModalOpen(false);
      alert('해당 게시물을 삭제하는데 실패했어요!!');
    }
  });
  console.log(data, 'Data');
  return (
    <div className="settingwrap">
      {modalOpen && (
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          deleteMutation={deleteMutation}
          modalUse="delete"
        />
      )}

      <UploadImage
        url={`board`}
        component={['title', 'description']}
        elementType={['input', 'textarea']}
        buttontext={['삭제', '수정']}
        hashtrue={true}
        buttonColor={['#dee2e6']}
        labelTrue={true}
        setModalOpen={() => setModalOpen((prev) => !prev)}
        elementValue={{
          title: data?.board.title,
          description: data?.board.description,
          hashtag: data?.board.boardTag[0].hashtag
        }}
      />

      <style jsx>{`
        .settingwrap {
          width: 50vw;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default BoardSetting;
