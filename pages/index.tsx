import ImageProduct from '@components/imageproduct';
import Layout from '@components/layout';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>이름 못정했어</title>
          <meta name="description" content="Main Title" />
        </Head>
        {[1, 2, 3, 4, 5].map((v) => (
          <ImageProduct key={v} />
        ))}
        <Link href={'/register'}>
          <a>
            <button>SIGNUP</button>
          </a>
        </Link>
        <Link href={'/signin'}>
          <a>
            <button>SIGNIN</button>
          </a>
        </Link>
        <Link href={'/test'}>
          <a>
            <button>Test User</button>
          </a>
        </Link>
      </div>
    </Layout>
  );
};

export default Home;
