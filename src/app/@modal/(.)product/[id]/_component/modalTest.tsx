import BackButton from '@app/@modal/(.)product/[id]/_component/backButton';
import SusTest from '@app/@modal/(.)product/[id]/_component/susTest';
import DetailModal from '@components/DetailModal';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function ModalTest({ params }: Props) {
  const { id } = await params;
  console.log(id, 'IDAD');
  return (
    <DetailModal>
      <div className="fixed inset-0 z-[999] mx-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8">
        {/* <Suspense fallback={<Loading />}> */}
        <SusTest id={id} />
        {/* <div className="z-10 w-[50%] h-full bg-white rounded-[32px]">
            ABCDE
          </div> */}
        {/* </Suspense> */}
        <BackButton />
      </div>
    </DetailModal>
  );
}
