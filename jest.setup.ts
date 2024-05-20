import '@testing-library/jest-dom';
import worker from './mocks/browser';

beforeAll(() => worker.listen());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.close());
