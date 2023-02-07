import { useState, Dispatch, SetStateAction, useMemo } from 'react';

import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

import Button from '@components/button';
import { UseMutateFunction } from 'react-query';
import { boardChat, UploadChatResponse } from 'pages/board/[boardId]';

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const modules = {
  toolbar: {
    container: '#toolbar'
  },
  //   toolbar: [
  //     [{ header: '1' }, { header: '2' }, { font: [] }],
  //     [{ size: [] }],
  //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  //     [
  //       { list: 'ordered' },
  //       { list: 'bullet' },
  //       { indent: '-1' },
  //       { indent: '+1' }
  //     ],
  //     ['link', 'image', 'video'],
  //     ['clean']
  //   ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
};
const formats = [
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
];

const CustomToolbar = () => (
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
);
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
}
const Editor = ({ mutate, isLoading, btntrue, setter }: EditorProps) => {
  const [chat, setChat] = useState('');

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
      {btntrue && (
        <div className="chatinput_btn">
          <div>
            <Button isLoading={false} text="작성" onClick={submitText} />
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
      `}</style>
    </div>
  );
};

export default Editor;