import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import fetchArtists from '../config/db/controllers/fetchArtists';

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const artist = req.session.artist;
    const props = {};
    if (artist) {
      props.artist = req.session.artist;
    }
    return { props };
  },
  sessionOptions
);

export default function LoginArtists(props) {
  const router = useRouter();
  console.log('artist:', props.artist);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsArtist, setIsUser, setIsLoggedIn, setArtistId, artistIdNew } = useUserData();

  useEffect(() => {
    setIsUser(false);
    setIsArtist(true);
  }, []);

  async function handleLogin(event) {
    event.preventDefault();

    if (username && password) {
      setIsLoading(true);

      try {
        const action = 'loginArtist';
        const response = await fetch(`/api/auth/${action}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const artistData = await fetchArtists();
          const artistArray = artistData.data;
          const artist = artistArray.find((artist) => artist.username === username);
          const artistIdNew = artist ? artist._id : null;

          setArtistId(artistIdNew);

          console.log('artistIdNew' + artistIdNew)

          cookie.set("token", JSON.stringify({ username, isUser: false, isArtist: true, isLoggedIn: true, artistIdNew }), { expires: 365 }); 
          setIsLoggedIn(true); 
          setMessage('Login successful');
          router.push('/');
        } else if (response.status === 400) {
          const data = await response.json();
          setMessage(data.message || 'Invalid credentials');
        } else {
          setMessage('Login failed');
        }
      } catch (error) {
        console.error('Login failed:', error);
        setMessage('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
        <div className="bg-black card">
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    disabled={isLoading}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>

    </>
);
}
