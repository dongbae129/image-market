import { Dispatch, SetStateAction } from 'react';

interface HashtagProps {
  hashtag: string[];
  setHashtag: Dispatch<SetStateAction<string[]>>;
}
const InputHashtag = ({ hashtag, setHashtag }: HashtagProps) => {
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      if (hashtag.includes(target.value)) {
        alert('중복태그 불가능합니다');
        return;
      }
      if (hashtag.length > 4) {
        alert('해쉬태그는 5개까지 가능합니다');
        return;
      }
      setHashtag(hashtag.concat(target.value));

      target.value = '';
    }
  };
  const deleteHashtag = (index: number) => () => {
    setHashtag((prev) => prev.filter((v, i) => i !== index));
  };
  return (
    <div className="hashtagwrap">
      <div className="hashinput">
        <label htmlFor="hash">태그</label>
        <div className="input-div">
          <input
            id="hash"
            type="text"
            placeholder="태그 입력후 엔터"
            onKeyUp={onKeyUp}
            name="hash"
          />
        </div>
      </div>

      <div>
        {hashtag.map((v, i) => (
          <span className="hashtag" key={i} onClick={deleteHashtag(i)}>
            <span>#</span>
            <span>{v}</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        .hashtagwrap {
          width: 100%;
        }
        .hashinput {
          margin-bottom: 1rem;
        }
        .hashtag {
          background-color: #f8f9fa;
          display: inline-block;
          border-radius: 1rem;
          height: 2rem;
          line-height: 2rem;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-right: 0.75rem;
          margin-bottom: 1rem;
          &:hover {
            cursor: pointer;
            background-color: darkgray;
          }
          span {
            font-weight: bold;
          }

          span:nth-child(1) {
            color: #12b886;
            font-weight: bold;
            padding-right: 0.2rem;
          }
        }
        .inputwrap {
          height: 100%;
          position: relative;
        }
        .input-div {
          height: 100%;
          margin-top: 0.25rem;
          margin-bottom: 1rem;
        }
        label {
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }

        input {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          border: none;
          padding: 0.5rem;
          padding-left: 0.5rem;
          font-size: 1rem;
          outline: 1px solid rgba(0, 0, 0, 0.16);

          &:focus {
            outline: 3px solid rgb(127, 193, 255);
          }
        }
      `}</style>
    </div>
  );
};

export default InputHashtag;
