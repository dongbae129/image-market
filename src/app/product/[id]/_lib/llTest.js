// lib/loader.js
export default function LoaderTest({ src, width, quality }) {
  // worker 주소가 https://my-worker.계정명.workers.dev 라면
  // const WORKER_URL = 'https://icy-salad-6dda.dobae129.workers.dev';
  const WORKER_URL = 'https://d18ktmttqdka9f.cloudfront.net';

  // 리사이징은 유료 기능이므로, 여기서는 원본을 요청하되
  // URL 뒤에 width를 파라미터로 붙여서 나중에 확장할 수 있게 구성합니다.
  // return `${WORKER_URL}/?url=${src}&w=${width}`;
  return `${WORKER_URL}/${src}?w=${width}&q=${quality || 75}`;
}
