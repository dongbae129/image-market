import PurchaseHistory from './_components/PurchaseHistory';

export default function PurchasesPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-76px)] max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">구매한 이미지</h1>
      <p className="mt-2 text-slate-600">
        구매한 Pro 버전을 확인하고 다시 다운로드할 수 있습니다.
      </p>
      <PurchaseHistory />
    </main>
  );
}
