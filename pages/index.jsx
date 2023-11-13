import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import GeoLocationData from '../components/geolocationData';
import placeholder from 'public/placeholder.jpeg'

export default function Home() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const { userId, setUserId, isLoggedIn, isUser, setArtistId, artistIdNew } = useUserData();
    const { geolocationData } = GeoLocationData();
    const { savedArtists, setSavedArtists } = useUserData();
    const [tattooStyle, setIsTattooStyle] = useState(false);
    const [selectedButtons, setSelectedButtons] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = cookie.get('token');

                if (token) {
                    const { username, userId, artistIdNew } = JSON.parse(token);
                    setUsername(username);
                    setUserId(userId);
                    setArtistId(artistIdNew);
                    console.log('artistId is' + artistIdNew);
                }


                if (userId) {
                    // Fetch saved artists data
                    const savedArtistsResponse = await fetch(`/api/user/${userId}/savedArtists`);
                    if (!savedArtistsResponse.ok) {
                        throw new Error(`Failed to fetch saved artists data. Status: ${savedArtistsResponse.status}`);
                    }

                    // Parse response
                    const savedArtistsData = await savedArtistsResponse.json();

                    // Set saved artists data to the context
                    setSavedArtists(savedArtistsData);
                }

                // Fetch other data (user and artist)
                const [userResponse, artistResponse] = await Promise.all([
                    fetch('/api/user'),
                    fetch('/api/artist'),
                ]);

                // Check if responses are OK
                if (!userResponse.ok || !artistResponse.ok) {
                    throw new Error(`Failed to fetch user or artist data.`);
                }

                // Parse responses
                const userData = await userResponse.json();
                const artistData = await artistResponse.json();




                // Store user data
                setData(artistData);

                if (Array.isArray(artistData.data) && artistData.data.length > 0) {
                    console.log('artistData:', artistData.data);

                    // Access the first item's _id
                    console.log('First artist _id:', artistData.data[0]._id);
                } else {
                    console.log('No artist data available.');
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, [setUserId]);

    const changeButtonColor = (buttonName) => {
        setSelectedButtons((prevState) => ({
            ...prevState,
            [buttonName]: !prevState[buttonName],
        }));
    };
    async function saveArtist(artistId, userId) {
        console.log('saveArtist function called');
        console.log('artistId:', artistId);
        console.log('userId:', userId);
        try {
            // Check if the artist is already saved
            if (savedArtists && savedArtists[artistId]) {
                console.log('Artist is already saved');
                setMessage('Artist is already saved');
            } else {
                // Save the artist
                console.log('Saving artist...');
                const res = await fetch(`/api/user/${userId}/savedArtists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artistId, userId }),
                });

                console.log('Response:', res);

                if (res.status === 201) {
                    // Update savedArtists in the context
                    setSavedArtists((prevSavedArtists) => ({
                        ...prevSavedArtists,
                        [artistId]: true,
                    }));
                    setMessage('Artist added successfully');
                    console.log('Artist added successfully');
                } else {
                    console.error('Failed to save artist');
                    setMessage('Failed to save artist');
                    console.log('Failed to save artist');
                }
            }
        } catch (error) {
            console.error('Error saving artist:', error);
            setMessage('Error saving artist');
        }
    }

    async function tattooStyles() {
        setIsTattooStyle((prevState) => !prevState);
    }


    return (
        <>
            {isLoggedIn ? (
                <div>
                    <h1>Home</h1>
                    <h2>Welcome, {username}</h2>
                    {isUser ? (
                        <div> Id: {userId} </div>
                    ) : (
                        <div> Id : {artistIdNew} </div>
                    )}
                    <div>
                        Hey friend! It looks like you are in {geolocationData?.address?.city},{' '}
                        {geolocationData?.address?.state} at area code {geolocationData?.address?.postalCode}. Here's a list of
                        artists that are near you!
                    </div>

                    <div class="card">
                        <button
                            className={selectedButtons['location'] ? 'selected' : ''}
                            onClick={() => changeButtonColor('location')}
                        >
                            {' '}
                            Filter By Location{' '}
                        </button>
                        <button className={selectedButtons['likes'] ? 'selected' : ''} onClick={() => changeButtonColor('likes')}>
                            {' '}
                            Filter By # of Likes
                        </button>
                        <button
                            className={selectedButtons['tattoostyle'] ? 'selected' : ''}
                            onClick={() => {
                                tattooStyles();
                                changeButtonColor('tattoostyle');
                            }}
                        >
                            {' '}
                            Filter By Tattoo Style{' '}
                        </button>
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
                            ) : null}
                        </div>
                    </div>

                    {data && data.data && (
                        <div>
                            <h3>Click on each card to access artist profile pages!</h3>
                            {error ? (
                                <p>Error fetching artists: {error}</p>
                            ) : (
                                <ul style={{ padding: "0px" }}>
                                    {data.data.map((item, index) => (
                                        <div key={index} className="card m-4">
                                            {/* Link to artist profile page */}
                                            <Link href="/artist/[artistId]" as={`/artist/${item._id}`}>

                                                <h3 className="custom-card-header">
                                                    {item.firstname} {item.lastname}
                                                </h3>

                                                <div style={{ borderRadius: "50%", border: "8px solid orange", overflow: "hidden", width: 100, height: 100 }} class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                                    <img src={item.profilePicture ? item.profilePicture : placeholder} width={100} height={100} alt={`${item.firstname} ${item.lastname}`} />
                                                </div>
                                                <p>@{item.username}</p>
                                                <p>Location: {item.location} </p>
                                                {item.tattooStyle && item.tattooStyle.length > 0 && (
                                                    <div>
                                                        <p>Tattoo Styles:</p>
                                                        <ul>
                                                            {item.tattooStyle.map((style, styleIndex) => (
                                                                <li key={styleIndex}>{style}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                            </Link>
                                            {isUser ? (
                                                <button
                                                    className={savedArtists && savedArtists[item._id] ? 'saved-button' : ''}
                                                    onClick={() => saveArtist(item._id, userId)}
                                                >
                                                    {savedArtists && savedArtists[item._id] ? 'Saved Artist' : 'Save Artist'}
                                                </button>
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
                    <Link href="/signup">Login</Link>
                </div>
            )}
        </>
    );
}