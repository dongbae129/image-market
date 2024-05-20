import { setupServer } from 'msw/node';
// import { handlers } from './handlers';

import { handlers } from './handlers';
// const worker = setupServer(...handlers);
import { setupWorker } from 'msw/browser';
const worker = setupServer(...handlers);
// This configures a Service Worker with the given request handlers.
// export const worker =
//   process.env.NODE_ENV === 'test' ? setupWorker(...handlers) : null;
// const worker = setupWorker(...handlers);
// if (typeof window !== 'undefined') {
// worker.start();
// }

export default worker;
