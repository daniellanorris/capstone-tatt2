import { UserContextProvider } from '../context/userContext';
import Footer from '../components/footer';
import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../public/styles/global.css'


function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </UserContextProvider>
  );
}

export default MyApp;
