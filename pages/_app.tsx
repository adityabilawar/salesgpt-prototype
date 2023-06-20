import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import store from '../components/store';
import withLayoutAndAuth from '@/components/withLayoutAndAuth';

function App({ Component, pageProps, router }: AppProps) {
  const { route } = router;
  let Layout = Component;
  if (!['/login', '/sign-up', '/onboarding'].includes(route)) {
    Layout = withLayoutAndAuth(Layout);
  }

  return (
    <>
      <Head>
        <title>Pipeline AI</title>
        <meta name="description" content="SalesGPT App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Provider store={store}>
        <Layout {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
