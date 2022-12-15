import Input from '@components/input';
import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { IoIosSearch } from 'react-icons/io';

interface HeadSearch {
  search: string;
}
interface UploadProductForm {
  image: FileList;
  title: string;
  description?: string;
  productAuth: boolean;
  ratio: number;
}
const HeadMenu: NextPage = () => {
  const { register, handleSubmit } = useForm<HeadSearch>();

  const { mutate } = useMutation(() =>
    axios.get('test').then((res) => res.data)
  );

  const onValid = ({ search }: HeadSearch) => {
    console.log(search);
  };
  //   const onValid = ({ search }: HeadSearch) => {
  //     console.log(search, 'menu');
  //     // mutate(search);
  //   };
  return (
    <div className="headmenuwrap">
      <div className="golinkwrap">
        <Link href={'/'}>
          <span className="golinkinhead">HOME</span>
        </Link>

        <Link href={'/upload'}>
          <span className="golinkinhead">UPLOAD</span>
        </Link>
      </div>
      <div className="searchform">
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            // label="search"
            name="search"
            type="text"
            paddingleft="3rem"
            required
            register={register('search', { required: true })}
            // style={{ width: '100%' }}
          />
          <div className="searchbutton">
            <IoIosSearch size={'100%'} />
          </div>
        </form>
      </div>
      <div className="golinkwrap">
        <Link href={'/signin'}>
          <span className="golinkinhead">SIGNIN</span>
        </Link>
        <Link href={'/register'}>
          <span className="golinkinhead">SIGNUP</span>
        </Link>
      </div>
      <style jsx>{`
        .headmenuwrap {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 4rem;
          padding: 4px;
          padding-left: 16px;
          padding-right: 16px;
          margin-bottom: 1rem;

          .golinkwrap {
            display: flex;
            align-items: center;
            height: 100%;
            span {
              font-weight: 700;
              font-size: 1.3rem;
            }

            > span:first-child {
              margin-right: 1rem;
            }
          }
        }
        .golinkinhead {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 5rem;
          height: 80%;
          cursor: pointer;
          border-bottom: 3px solid rgba(51, 154, 240, 0);

          :hover {
            border-bottom: 3px solid rgba(51, 154, 240, 1);
          }
        }
        .searchform {
          width: 60%;
          height: 80%;
          position: relative;
          border-radius: 10px;
          > form {
            position: absolute;
            height: 100%;
            width: 100%;
          }
        }
        .searchinput {
          input {
            width: 100%;
          }
        }
        .searchbutton {
          position: absolute;
          margin-left: 10px;
          height: 80%;
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
};

export default HeadMenu;
