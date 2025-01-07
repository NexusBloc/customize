import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Base, BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import Head from "next/head";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
// const activeChain = Base;
const activeChain = BaseSepoliaTestnet;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
    >
      <Head>
                {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
                <meta name="title" content="WeepingPlebs - Workshop " />
                <meta name="description" content="Weep Now, Fade Later" />
                <meta name="keywords" content="customize, dapp, weep" />
                <meta name="author" content="Weep Lab" />
            </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
