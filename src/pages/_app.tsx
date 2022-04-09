import { LayoutContextProvider } from "context/layout/layout.context";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <LayoutContextProvider>
      <Component {...pageProps} />
    </LayoutContextProvider>
  );
}

export default MyApp;
