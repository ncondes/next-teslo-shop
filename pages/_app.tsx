import { CssBaseline, ThemeProvider } from '@mui/material';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { AuthProvider, CartProvider, UiProvider } from '../context';
import '../styles/globals.css';
import { lightTheme } from '../themes';

function MyApp({ Component, pageProps }: AppProps) {
   const AnyComponent = Component as any;

   return (
      <SessionProvider>
         <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
            <SWRConfig
               value={{
                  fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
               }}
            >
               <AuthProvider>
                  <CartProvider>
                     <UiProvider>
                        <ThemeProvider theme={lightTheme}>
                           <CssBaseline />
                           <AnyComponent {...pageProps} />
                        </ThemeProvider>
                     </UiProvider>
                  </CartProvider>
               </AuthProvider>
            </SWRConfig>
         </PayPalScriptProvider>
      </SessionProvider>
   );
}

export default MyApp;
