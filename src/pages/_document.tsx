import Document, { Main, NextScript, Head, Html } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                </Head>
                <body className='text-gray-900'>
                    <Main />
                    <NextScript />
                </body>
            </Html>);

    }
}


export default MyDocument;