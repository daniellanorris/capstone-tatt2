import { UserContextProvider } from '../context/userContext';
import Footer from '../components/footer';
import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import '../public/styles/global.css';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {

      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false); 
    };

    fetchData();
  }, []);

  return (
    <UserContextProvider>
      <Header />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      ) : (
        <Component {...pageProps} />
      )}
      <Footer />
    </UserContextProvider>
  );
}

export default MyApp;
