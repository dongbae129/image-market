import {
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback
} from 'react';

import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Button from '@components/button';
import { UseMutateFunction } from 'react-query';

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>
});
interface EditorProps {
  mutate: UseMutateFunction<any, any, any>;
  // mutate: UseMutateFunction<UploadChatResponse, any, boardChat>;
  isLoading: boolean;
  btntrue?: boolean;
  setter?: Dispatch<SetStateAction<string>>;
  labelTrue?: boolean;
  btnActive: boolean;
  chatValue: string;
}
const Editor = ({
  mutate,
  isLoading,
  btntrue,
  setter,
  labelTrue,
  btnActive,
  chatValue
}: EditorProps) => {
  const [chat, setChat] = useState(chatValue);
  useEffect(() => {
    setChat(chatValue);
  }, [chatValue]);

  const formats = useMemo(
    () => [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'list',
      'bullet',
      'align',
      'color',
      'background',
      'link'
    ],
    []
  );
  const CustomToolbar = useCallback(
    () => (
      <div
        id="toolbar"
        className="testtool"
        style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
      >
        <select className="ql-header">
          <option value="1"></option>
          <option value="2"></option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <select className="ql-color">
          <option value="black"></option>
          <option value="red"></option>
          <option value="green"></option>
          <option value="blue"></option>
          <option value="orange"></option>
          <option value="violet"></option>
        </select>
        <select className="ql-background"></select>
        <button className="ql-link"></button>
      </div>
    ),
    []
  );

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: '#toolbar'
      },
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false
      }
    };
  }, []);

  const handleText = (value: any) => {
    setChat(value);
    if (setter) setter(value);
  };

  const submitText = () => {
    if (isLoading) return;
    mutate({ chat });
    setChat('');
  };
  const editorInput = {
    height: 'calc(100% - 42px)'
    // minHeight: '300px'
  };

  return (
    <div className="editor">
      <div>
        {labelTrue && <label htmlFor="editor_label">본문</label>}
        <div id="editor_label">
          <CustomToolbar />
          <QuillNoSSRWrapper
            onChange={handleText}
            value={chat}
            modules={modules}
            formats={formats}
            theme="snow"
            className="editor_input"
            style={editorInput}
          />
        </div>
      </div>
      {btntrue && (
        <div className="chatinput_btn">
          <div>
            <Button
              isLoading={false}
              text="작성"
              onClick={submitText}
              disabled={btnActive ? true : false}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .editor {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          > div:first-child {
            height: 100%;
          }
        }
        .chatinput_btn {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.8rem;

          > div {
            width: 15%;
            min-width: 90px;
          }
        }
        label {
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        #editor_label {
          height: 100%;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default Editor;
