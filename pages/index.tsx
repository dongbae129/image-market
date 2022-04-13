import ImageProduct from "@components/imageproduct";
import type { NextPage } from "next";
import Head from "next/head";

import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>이름 못정했어</title>
        <meta name="description" content="Main Title" />
      </Head>
      {[1, 2, 3, 4, 5].map((v) => (
        <ImageProduct key={v} />
      ))}
    </div>
  );
};

export default Home;
