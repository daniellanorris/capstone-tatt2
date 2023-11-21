import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import GeoLocationData from '../components/geolocationData';
import placeholder from 'public/placeholder.jpeg';
import fetchUsers from '../config/db/controllers/fetchUsers';


export default function Home() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const {
        userId,
        setUserId,
        isLoggedIn,
        isUser,
        isArtist,
        setArtistId,
        artistIdNew,
        setIsLoggedIn,
        setIsUser,
        setIsArtist,
    } = useUserData();


    console.log('beginning' + artistIdNew)
    const { geolocationData } = GeoLocationData();
    const { savedArtists, setSavedArtists } = useUserData();
    const [tattooStyle, setIsTattooStyle] = useState(false);
    const [selectedButtons, setSelectedButtons] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 750);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [artistId, setArtistSelect] = useState('')



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = cookie.get('token');

                if (token) {
                    const { username, userId, artistIdNew, isUser, isArtist } = JSON.parse(token);
                    console.log(isArtist)
                    setUsername(username);

                    if (isUser === true) {
                        setIsUser(isUser);
                        setUserId(userId);

                    }
                    if (isArtist === true) {
                        setIsArtist(true)
                        setArtistId(artistIdNew)
                        console.log('afterwards' + artistIdNew)

                    }


                }

                if (userId) {
                    const savedArtistsResponse = await fetch(`/api/user/${userId}/savedArtists`);

                    if (!savedArtistsResponse.ok) {
                        throw new Error(`Failed to fetch saved artists data. Status: ${savedArtistsResponse.status}`);
                    }

                    const savedArtistsData = await savedArtistsResponse.json();
                    setSavedArtists(savedArtistsData);
                    console.log('savedartists', savedArtistsData);
                }

                if (artistIdNew) {
                    setIsArtist(true)
                    setArtistSelect(artistId)
                }

                const userResponse = await fetch('/api/user');

                if (!userResponse.ok) {
                    throw new Error(`Failed to fetch user data. Status: ${userResponse.status}`);
                }

                const userData = await userResponse.json();
                setData(userData);

                if (Array.isArray(userData.data) && userData.data.length > 0) {
                } else {
                    console.log('No user data available.');
                }

                const artistResponse = await fetch('/api/artist');

                if (!artistResponse.ok) {
                    throw new Error(`Failed to fetch artist data. Status: ${artistResponse.status}`);
                }

                const artistData = await artistResponse.json();
                setData(artistData);
                setIsLoggedIn(true);

                if (artistData) {
                    setSelectedArtist(artistData.data[0]);
                    console.log(artistData.data[0])
                }

                if (Array.isArray(artistData.data) && artistData.data.length > 0) {

                } else {
                    console.log('No artist data available.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };
        console.log('artistId check', artistIdNew)
        fetchData();
    }, [userId, setUserId, setSavedArtists, isUser, isArtist, artistIdNew]);

    useEffect(() => {
        if (selectedArtist && typeof selectedArtist === 'object') {
            console.log('Selected Artist ID:', selectedArtist._id);
        } else {
            console.log('No selected artist or not an object');
        }
    }, [selectedArtist]);

    console.log('test' + artistIdNew)

    useEffect(() => {
        const users = fetchUsers();

        if (users && users.data && users.data.length > 0) {
          const userSavedArtists = users.data.find((user) => {
            return user.data && user.data.savedArtists &&
              user.data.savedArtists.length > 0 &&
              user.data.savedArtists.every(artist => savedArtists.includes(artist));
          });
        
          setSavedArtists(userSavedArtists);
          console.log('savedartists'+ savedArtists)
        } else {
          console.error('Error fetching users or users data is empty');
        }
    }, [])


    useEffect(() => {
        console.log('testing use effect' + artistIdNew);

    }, [artistIdNew]);

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
                    setSavedArtists((savedArtists) => ({
                        ...savedArtists,
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

    async function setSize() {
        setIsDesktop(window.innerWidth > 750)

    }

    useEffect(() => {
        window.addEventListener("resize", setSize)
        return () => window.removeEventListener("resize", setSize)
    });

    const setArtist = (index) => {
        setSelectedArtist(data.data[index]);
        console.log(selectedArtist)

    };

    console.log('testing' + artistIdNew)

    return (

        <div style={{ marginLeft: "10px" }}>
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

                    <div class="container" style={{ marginTop: "20px", marginBottom: "20px" }}>
                        <div class="row">
                            <div class="col-12 d-flex align-items-center justify-content-center">
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
                            </div>
                            <div>
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
                        </div>

                    </div>


                    {data && data.data && (
                        isDesktop ? (
                            <div className="container">
                                <div className="row">
                                    <h3>Click on each card to access artist profile pages!</h3>
                                    <div className="col-5">
                                        {error ? (
                                            <p>Error fetching artists: {error}</p>
                                        ) : (
                                            <ul style={{ padding: "0px" }}>
                                                {data.data.map((item, index) => (
                                                    <div key={index} onClick={() => setArtist(index)} className="card mt-4 d-flex justify-content-end">
                                                        <h3 className="custom-card-header">
                                                            {item.firstname} {item.lastname}
                                                        </h3>
                                                        <div style={{ borderRadius: "50%", border: "8px solid orange", overflow: "hidden", width: 100, height: 100 }} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
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
                                                        {isUser ? (
                                                            <button
                                                                style={{ width: "50%" }}
                                                                className={`button ${savedArtists && savedArtists[item._id] ? 'selected' : ''}`}
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
                                    <div className="col-7 mt-4 dark-card">
                                        <div className="card mt-4 d-flex justify-content-end">
                                            <div className="col-9">
                                                <ul style={{ padding: "0px" }}>
                                                    {selectedArtist ? (
                                                        <div className="card m-4 d-flex justify-content-end">
                                                            <Link href="/artist/[artistId]" as={`/artist/${selectedArtist._id}`}>
                                                                <h3 className="custom-card-header">
                                                                    {selectedArtist.firstname} {selectedArtist.lastname}
                                                                </h3>
                                                                <div style={{ borderRadius: "50%", border: "8px solid orange", overflow: "hidden", width: 100, height: 100 }} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                                                    <img src={selectedArtist.profilePicture ? selectedArtist.profilePicture : placeholder} width={100} height={100} alt={`${selectedArtist.firstname} ${selectedArtist.lastname}`} />
                                                                </div>
                                                                <p>@{selectedArtist.username}</p>
                                                                <p>Location: {selectedArtist.location} </p>
                                                                {selectedArtist.tattooStyle && selectedArtist.tattooStyle.length > 0 && (
                                                                    <div>
                                                                        <p>Tattoo Styles:</p>
                                                                        <ul>
                                                                            {selectedArtist.tattooStyle.map((style, styleIndex) => (
                                                                                <li key={styleIndex}>{style}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </Link>

                                                            {isUser ? (
                                                                <button
                                                                    style={{ width: "50%" }}
                                                                    className={`button ${savedArtists && savedArtists[selectedArtist._id] ? 'selected' : ''}`}
                                                                    onClick={() => saveArtist(selectedArtist._id, userId)}
                                                                >
                                                                    {savedArtists && savedArtists[selectedArtist._id] ? 'Saved Artist' : 'Save Artist'}
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        null

                                                    )}

                                                </ul>
                                            </div>
                                        </div>
                                        <div className="card m-4 d-flex justify-content-end">
                                            <div className="row">
                                                {selectedArtist && selectedArtist.image && Object.values(selectedArtist.image).map((imageUrl, index) => (
                                                    <div key={index} className="col-lg m-3">
                                                        <div className="card image-container">
                                                            <img src={imageUrl} alt={`Image ${index}`} className="card-img-top img-fluid" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="row">
                                    <h3>Click on each card to access artist profile pages!</h3>
                                    <div className="col-10">
                                        {error ? (
                                            <p>Error fetching artists: {error}</p>
                                        ) : (
                                            <ul style={{ padding: "0px" }}>
                                                {data.data.map((item, index) => (
                                                    <div key={index} className="card m-4 d-flex justify-content-end">
                                                        <Link href="/artist/[artistId]" as={`/artist/${item._id}`}>
                                                            <h3 className="custom-card-header">
                                                                {item.firstname} {item.lastname}
                                                            </h3>
                                                            <div style={{ borderRadius: "50%", border: "8px solid orange", overflow: "hidden", width: 100, height: 100 }} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
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
                                                                style={{ width: "50%" }}
                                                                className={`button ${savedArtists && savedArtists[item._id] ? 'selected' : ''}`}
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
                                </div>
                            </div>
                        )
                    )}
                    {message && <p>{message}</p>}
                </div>
            ) : (
                <div>
                    <h3>Whoa, there! </h3>
                    <p>You are not logged in. Please log in.</p>
                    <Link href="/login">
                        <button>Login</button>
                    </Link>
                </div>
            )}
        </div>
    );

}
