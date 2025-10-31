import Search from '@app/product/_comonent/productSearch';
import { Suspense } from 'react';

export default function ProductPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
