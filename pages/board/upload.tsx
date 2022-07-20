import UploadImage from '@components/uploadImage';
import { NextPage } from 'next';

const boardUpload: NextPage = () => {
  return (
    <UploadImage
      url="board"
      component={['title', 'description']}
      elementType={['input', 'textarea']}
    />
  );
  // return <Upload url="board" />;
};

export default boardUpload;
