import type { AppProps } from "next/app";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId="your-client-id" // Получите на https://thirdweb.com/dashboard
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
