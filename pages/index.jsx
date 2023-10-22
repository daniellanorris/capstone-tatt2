import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import GeoLocationData from '../components/geolocationData';

export default function Home() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const { userId, setUserId, isUser, isArtist } = useUserData();
    const { geolocationData } = GeoLocationData();
    const {isLoggedIn} = useUserData()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                const userResponse = await fetch('/api/user');
                if (!userResponse.ok) {
                    throw new Error(`Failed to fetch user data. Status: ${userResponse.status}`);
                }

                // Fetch artist data
                const artistResponse = await fetch('/api/artist');
                if (!artistResponse.ok) {
                    throw new Error(`Failed to fetch artist data. Status: ${artistResponse.status}`);
                }

                // Parse responses
                const userData = await userResponse.json();
                const artistData = await artistResponse.json();

                // Store user data
                setData(userData);

                // Handle user data
                const token = cookie.get('token');
                if (token) {
                    const { username, userId } = JSON.parse(token);
                    setUsername(username);
                    setUserId(userId);
                    console.log('new user Id' + userId); // this provides the ID, this is good
                }

                setData(artistData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, [setUserId]);

    async function saveArtist(artistId, userId) {
        console.log('userId: ' + userId);
        console.log('artistId: ' + artistId);
        try {
            const res = await fetch(`/api/user/${userId}/savedArtists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ artistId }),
            });

            if (res.status === 201) {
                console.log('Artist saved successfully');
                setMessage('Artist saved successfully');
            } else {
                console.error('Failed to save artist');
                setMessage('Failed to save artist');
            }
        } catch (error) {
            console.error('Error saving artist:', error);
            setMessage('Error saving artist');
        }
    }

    return (
        <>
            {isLoggedIn ? (
                <>
                    <h1>Home</h1>
                    <h2>Welcome, {username}</h2>
                    <div> {userId} </div>
                    <div> Hey friend! It looks like you are in {geolocationData?.address?.city}, {geolocationData?.address?.state} at area code {geolocationData?.address?.postalCode}. Here's a list of artists that are near you!</div>
                    {data && data.data && (
                        <div className="card">
                            Artists:
                            {error ? (
                                <p>Error fetching artists: {error}</p>
                            ) : (
                                <ul>
                                    {data.data.map((item, index) => (
                                        <div key={index} className="card m-5">
                                            <Link href="/artist/[artistId]" as={`/artist/${item._id}`}>
                                                <p>Username: {item.username}</p>
                                                <p>First Name: {item.firstname}</p>
                                                <p>Last Name: {item.lastname}</p>
                                                <p>Body: </p>
                                            </Link>
                                            <button onClick={() => saveArtist(item._id, userId)}>Save Artist</button>
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    {message && <p>{message}</p>
                    }
                </>
            ) : (
                <div>
                    <p>You are not logged in. Please log in.</p>
                    <Link href="/signup"> Login </Link>
                </div>
            )}
        </>
    );
}
