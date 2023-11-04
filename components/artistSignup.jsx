import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import cookie from 'js-cookie';
import GeoLocationData from '../components/geolocationData';
import { useUserData } from '../context/userContext'; 

export default function SignupArtists() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [manuallyEnter, setManuallyEnter] = useState(false);
  const { isArtist, setIsArtist } = useUserData();
  const { setIsUser } = useUserData();
  const {isLoggedIn, setIsLoggedIn} = useUserData()

  const { geolocationData, error, loading } = GeoLocationData();

  useEffect(() => {
    setManuallyEnter(false);
    if (!loading && geolocationData && geolocationData.address) {
      setLocation(`${geolocationData.address.latitude}, ${geolocationData.address.longitude}`);
    }
  }, [geolocationData, loading]);

  async function handleValidation() {
    if (username && password && firstname && lastname && location) {
      const response = await fetch('/api/artist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname,
          location,
          isArtist, 
          image: [],
        }),
      });

      if (response.status === 201) {
        setMessage('Signup successful');
        const data = await response.json();
        const artistIdNew = data.data._id;
        cookie.set('token', JSON.stringify({ username, isArtist: true, isUser: false, isLoggedIn: true, artistIdNew}), { expires: 1 / 24 });
        setIsArtist(true); 
        setIsUser(false)
        setIsLoggedIn(true)
        router.push('/');
        console.log('response' +{ response });
      } else if (response.status === 400) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage('Signup failed');
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
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="Enter first name"
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Enter last name"
        />
        {manuallyEnter === true ? (
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Set location"
          />
        ) : null}
        <button onClick={() => setManuallyEnter(true)}> Manually enter location</button>
        <button onClick={() => setManuallyEnter(false)}> Pull auto location - more accurate</button>
        <button type="button" onClick={handleValidation}>
          Submit
        </button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}
