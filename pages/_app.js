import { UserContextProvider } from '../context/userContext';

const Footer = React.lazy(() => import('../components/footer'));

import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import '../public/styles/global.css';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {

      await new Promise(resolve => setTimeout(resolve, 3000));
      setLoading(false); 
    };

    fetchData();
  }, []);

  return (
    <div>
    <UserContextProvider>
      <div>
      <Header />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <h3>
          Loading...
          </h3>
        </div>
      ) : (
        <><Component {...pageProps} />   <Footer/></>
      )}
      </div>

    </UserContextProvider>
    </div>
  );

}

export default MyApp;
