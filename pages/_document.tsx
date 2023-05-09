import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html className="h-full">
        <Head>
          {/* <script
            defer
            src="https://developers.kakao.com/sdk/js/kakao.min.js"
          ></script> */}
        </Head>
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
