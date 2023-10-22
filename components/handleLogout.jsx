import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react'
import { useUserData } from '../context/userContext';

export default function Logout() {
  const router = useRouter();
  const {username} = useUserData()

  const handleLogout = () => {
    cookie.remove('token');

    router.push('/signup');
  };

  return (
      <>
    <div>
      <button onClick={handleLogout}>Logout : {username} </button>
    </div>
    </>
  );
}