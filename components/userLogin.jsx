import { useRouter } from 'next/router';
import React, { useState } from 'react';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';

export default function LoginUser() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setIsArtist, setIsUser, setIsLoggedIn } = useUserData();

  async function handleLogin() {
    if (username && password) {
      try {
        const response = await fetch('/api/auth/loginUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        if (response.status === 200) {
          const data = await response.json();
          const { username, isArtist, isUser } = data;
          setMessage('Login successful');
          setIsArtist(false);
          setIsUser(true);
          setIsLoggedIn(true);
          cookie.set('token', JSON.stringify({ username, isArtist, isUser, isLoggedIn: true }), { expires: 1 / 24 });
          router.push('/');
        } else {
          setMessage('Login failed. Please check your username and password.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setMessage('Login failed');
      }
    } else {
      setMessage('Please fill out all fields');
    }
  }

  return (
    <>
      <div className="bg-black card">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}
