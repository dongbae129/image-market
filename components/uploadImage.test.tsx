import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import UploadImage, { UploadImageProps } from '@components/uploadImage';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import { newAxios } from '@libs/client/fetcher';
import { Wrapper } from '@pages/signin.test';

const axiosPostResponse = {
  data: {
    ok: true,
    product: {
      id: 3
    },
    board: {
      id: 4
    }
  }
};

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const replaceMock = jest.fn();
let pushMock = jest.fn();
beforeEach(() => {
  pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: pushMock,
    replace: replaceMock,
    prefetch: jest.fn().mockResolvedValue(null),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn()
    },
    beforePopState: jest.fn(() => null),
    isFallback: false
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

const defaultProps: UploadImageProps = {
  url: 'product/upload',
  component: ['title', 'description', 'productAuth'],
  elementType: ['input', 'textarea', 'input'],
  buttontext: ['등록'],
  buttonColor: [],
  labelTrue: true,
  hashtrue: true,
  image: 'true'
};

jest.mock('@components/editor', () => {
  const EditorTest = () => {
    return <div data-testid="editor-mock">Editor Mock</div>;
  };
  EditorTest.displayName = 'editorTest';
  return EditorTest;
});
describe('UploadImage Component', () => {
  it('renders without crashing', () => {
    render(
      <Wrapper>
        <UploadImage {...defaultProps} />
      </Wrapper>
    );
    expect(screen.getByText('등록')).toBeInTheDocument();
  });

  it('updates imagePreview and uploads image file', async () => {
    userEvent.setup();
    jest.spyOn(newAxios, 'post').mockResolvedValue(axiosPostResponse);
    global.URL.createObjectURL = jest.fn(() => 'http://localhost/example.png');

    render(
      <Wrapper>
        <UploadImage {...defaultProps} />
      </Wrapper>
    );

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png'
    });
    const formData = new FormData();
    formData.append('file', file);

    const input = screen.getByLabelText<HTMLInputElement>(/image/i);

    await userEvent.upload(input, file);

    const titleInput = screen.getByRole<HTMLInputElement>('textbox', {
      name: '제목'
    });
    expect(titleInput).toBeInTheDocument();
    await userEvent.type(titleInput, 'titletest');
    expect(titleInput.value).toBe('titletest');
    await userEvent.click(screen.getByText('등록'));
    await waitFor(() =>
      expect(newAxios.post).toHaveBeenCalledWith(
        '/api/product/upload',
        expect.any(FormData)
      )
    );
    const calledData = (newAxios.post as jest.Mock).mock.calls[0][1];

    expect(calledData.get('file')).toEqual(file);
    expect(calledData.get('title')).toEqual(titleInput.value);
    await waitFor(() =>
      expect(replaceMock).toHaveBeenCalledWith(
        `/product/${axiosPostResponse.data.product.id}`
      )
    );
  });
});
