import '../styles/globals.css';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import buildClient from '../api/build-client';
import Header from '../components/header';

interface CustomAppProps extends AppProps {
  currentUser: { id: string; email: string } | null;
}

const AppComponent = ({ Component, pageProps, currentUser }: CustomAppProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </Head>
      <div className="app-container">
        <Header currentUser={currentUser} />
        <div className="page-container fade-in">
          <Component currentUser={currentUser} {...pageProps} />
        </div>
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appContext: AppContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
