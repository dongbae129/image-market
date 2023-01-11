import UploadImage from '@components/uploadImage';
import { NextPage } from 'next';

const boardUpload: NextPage = () => {
  return (
    <div className="boarduploadwrap">
      <UploadImage
        url="board"
        component={['title', 'description']}
        elementType={['input', 'textarea']}
        buttontext="등록"
      />
      <style jsx>{`
        .boarduploadwrap {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          max-width: 30rem;
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          margin: auto;
          margin-top: 5rem;
          padding: 2.5rem;
        }
      `}</style>
    </div>
  );
  // return <Upload url="board" />;
};

export default boardUpload;
