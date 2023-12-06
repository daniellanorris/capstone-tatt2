import { UserContextProvider } from '../context/userContext';
import Footer from '../components/footer';
import cookie from 'js-cookie';

import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import '../public/styles/global.css';

function MyApp({ Component, pageProps }) {

  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    if (isContentLoaded) {
      console.log('Component has finished loading.');
    }
  }, [isContentLoaded]);


  return (
      <UserContextProvider>
        <div>
          <Header />
              <div className="wrapper">
              <Component {...pageProps} onLoad={() => setIsContentLoaded(true)}  />
              </div>
              
               <Footer/>

    
        </div>
      </UserContextProvider>
  );
}

export default MyApp;
