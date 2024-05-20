// import { setupWorker } from 'msw/browser';
// import { handlers } from './handlers';
// import { setupServer } from 'msw/node';

// // const worker = setupWorker(...handlers);
// const worker = setupServer(...handlers);
// export default worker;
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
const worker = setupWorker(...handlers);

export default worker;
