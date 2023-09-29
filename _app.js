import { UserProvider } from '../contexts/UserContext';
require('dotenv').config();

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}



