import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://sdk.minepi.com/pi-sdk.js"
        strategy="beforeInteractive"
      />
      <Script
        id="pi-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `Pi.init({ version: "2.0", sandbox: true });`,
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
