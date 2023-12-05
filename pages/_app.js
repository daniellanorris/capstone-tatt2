import { UserContextProvider } from '../context/userContext';
import Footer from '../components/footer';
import cookie from 'js-cookie';

import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import '../public/styles/global.css';

function MyApp({ Component, pageProps }) {


  return (
      <UserContextProvider>
        <div>
          <Header />
           
              <Component {...pageProps} /> <Footer />
    
        </div>
      </UserContextProvider>
  );
}

export default MyApp;
