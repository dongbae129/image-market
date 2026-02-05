'use client';
import { useFeedDetail } from '@app/@modal/(.)product/[id]/_lib/useFeedQuery';
import Loading from '@app/@modal/(.)product/[id]/loading';
import { getProduct } from '@app/product/[id]/_lib/getProduct';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';

type Props = {
  id: string;
};
function LTest() {
  // const delay = (time: number) =>
  //   new Promise((resolve) => setTimeout(resolve, time));
  // await delay(2000);
  return <div>/RET@#$TEG</div>;
}
export default function SusTest({ id }: Props) {
  const { data, isFetching } = useFeedDetail(id);
  console.log(data, 'DATA');
  if (!data?.product?.title && isFetching) return <Loading />;
  return (
    <div>
      {data.product.title}
      {/* <div>
        <div>{data?.product?.title}</div>        
        <section>
          {isFetching ? (
            <div>
              <Loading />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data?.product?.description)
              }}
            />
          )}
        </section>
      </div> */}
    </div>
  );
}
