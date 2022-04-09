import { LayoutContextProvider } from "context/layout/layout.context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <LayoutContextProvider>
      <Component {...pageProps} />
    </LayoutContextProvider>
  );
}

export default MyApp;
