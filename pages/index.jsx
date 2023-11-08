import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import GeoLocationData from '../components/geolocationData';
import background from '../public/bg_1.jpg'

export default function Home() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const { userId, setUserId, isLoggedIn, isUser, setArtistId, artistIdNew } = useUserData();
    const { geolocationData } = GeoLocationData();
    const { savedArtists, setSavedArtists } = useUserData();
    const [tattooStyle, setIsTattooStyle] = useState(false)
    const [selectedButtons, setSelectedButtons] = useState(false);



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
                    const { username, userId, artistIdNew } = JSON.parse(token);
                    setUsername(username);
                    setUserId(userId);
                    setArtistId(artistIdNew)
                    console.log('artistId is' + artistIdNew)
                }
                setData(artistData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };
        fetchData();
    }, [setUserId]);

    async function hasSavedArtist(artistId) {
        return savedArtists && savedArtists[artistId];
    }

    const changeButtonColor = (buttonName) => {
        setSelectedButtons((prevState) => ({
            ...prevState,
            [buttonName]: !prevState[buttonName],
        }));
    };


    async function saveArtist(artistId) {
        if (savedArtists && hasSavedArtist(artistId)) {
            setMessage('Artist is already saved');
        } else {
            try {
                const res = await fetch(`/api/user/${userId}/savedArtists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artistId }),
                });

                if (res.status === 201) {
                    setSavedArtists({
                        ...savedArtists,
                        [artistId]: true,
                    });
                    setMessage('Artist added successfully');
                } else {
                    console.error('Failed to save artist');
                    setMessage('Failed to save artist');
                }
            } catch (error) {
                console.error('Error saving artist:', error);
                setMessage('Error saving artist');
            }
        }
    }

    async function tattooStyles() {

        setIsTattooStyle((prevState) => !prevState);

    }

    async function removeArtist(artistId) {
        if (savedArtists && hasSavedArtist(artistId)) {
            try {
                const res = await fetch(`/api/user/${userId}/savedArtists`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artistId }),
                });

                if (res.status === 200) {
                    const { [artistId]: removed, ...newSavedArtists } = savedArtists;
                    setSavedArtists(newSavedArtists);
                    setMessage('Artist removed successfully');
                } else {
                    console.error('Failed to remove artist');
                    setMessage('Failed to remove artist');
                }
            } catch (error) {
                console.error('Error removing artist:', error);
                setMessage('Error removing artist');
            }
        } else {
            setMessage('Artist is not saved');
        }
    }

    return (
        <>
            {isLoggedIn ? (
                <div style={{ backgroundImage: `url(${background})` }}>
                    <h1>Home</h1>
                    <h2>Welcome, {username}</h2>
                    {isUser ? (<div> Id: {userId} </div>) : (<div> Id : {artistIdNew} </div>)}
                    <div> Hey friend! It looks like you are in {geolocationData?.address?.city}, {geolocationData?.address?.state} at area code {geolocationData?.address?.postalCode}. Here's a list of artists that are near you!</div>

                    <div class="card">
                        <button className={selectedButtons['location'] ? 'selected' : ''}
                            onClick={() => changeButtonColor('location')}> Filter By Location </button>
                        <button className={selectedButtons['likes']  ? 'selected' : ''}
                            onClick={() => changeButtonColor('likes')}> Filter By # of Likes</button>
                        <button className={selectedButtons['tattoostyle'] ? 'selected' : ''}
                            onClick={() => { tattooStyles(); changeButtonColor('tattoostyle') }}> Filter By Tattoo Style </button>
                        <div>
                            {tattooStyle === true ? (
                                    <div>
                                        <button
                                            buttonname="American Traditional"
                                            className={selectedButtons['American Traditional'] ? 'selected' : ''}
                                            onClick={() => changeButtonColor('American Traditional')}
                                        >
                                            American Traditional
                                        </button>
                                        <button
                                            buttonname="Japanese Traditional"
                                            className={selectedButtons['Japanese Traditional'] ? 'selected' : ''}
                                            onClick={() => changeButtonColor('Japanese Traditional')}
                                        >
                                            Japanese Traditional
                                        </button>
                                        <button
                                            buttonname="Fine Line"
                                            className={selectedButtons['Fine Line'] ? 'selected' : ''}
                                            onClick={() => changeButtonColor('Fine Line')}
                                        >
                                            Fine Line
                                        </button>
                                    </div>
                                ) : (
                                    null
                                )}
                        </div>
                    </div>
                    {data && data.data && (
                        <div> <h3>Click on each card to access artist profile pages! </h3>
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
                                                <p>Location: { } </p>
                                            </Link>
                                            {isUser ? (
                                                hasSavedArtist(item._id) ? (
                                                    <button onClick={() => removeArtist(item._id)}>Unsave Artist</button>
                                                ) : (
                                                    <button onClick={() => saveArtist(item._id)}>Save Artist</button>
                                                )
                                            ) : null}
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    {message && <p>{message}</p>}
                </div>
            ) : (
                <div>
                    <p>You are not logged in. Please log in.</p>
                    <Link href="/signup"> Login </Link>
                </div>
            )}


        </>

    );

}
