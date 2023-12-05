import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react'
import { useUserData } from '../context/userContext';

export default function Logout() {
  const router = useRouter();
  const {setIsLoggedIn} = useUserData()

  const handleLogout = () => {
    cookie.remove('token');
    setIsLoggedIn(false)

    router.push('/');
  };

  return (
      <>
    <div style={{ marginLeft: '10px' }}> 
      <button onClick={handleLogout}>Logout </button>
    </div>
    </>
  );
}