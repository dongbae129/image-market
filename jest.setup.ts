import '@testing-library/jest-dom';
import worker from './src/mocks/browser';

beforeAll(() => worker.listen());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.close());
