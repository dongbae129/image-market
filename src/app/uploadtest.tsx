import UploadImage from '@app/_components/uploadImage';
import type { NextPage } from 'next';

const Uploadtest: NextPage = () => {
  return (
    <div>
      <UploadImage image="image" component={['title', 'description']} />
    </div>
  );
};

export default Uploadtest;
