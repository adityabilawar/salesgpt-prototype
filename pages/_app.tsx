import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import store from './store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SalesGPT</title>
        <meta name="description" content="SalesGPT App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}
