import Document, { Main, NextScript, Head, Html } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-gray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
