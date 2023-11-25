import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import GeoLocationData from '../components/geolocationData';
import ArtistDetails from '../components/parentLike';
import { calculateDistance } from '../config/db/controllers/findDistance';

export default function Home() {
    const [userData, setUser] = useState(null);
    const [artistData, setArtistData] = useState({ data: [] });
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
        savedArtists,
        setSavedArtists,
        userLat,
        userLon,
        setUserData
    } = useUserData();

    console.log('beginning saved artists' + savedArtists);
    console.log(artistData)
    console.log(userLat, userLon)

    console.log('beginning' + artistIdNew);
    const { geolocationData } = GeoLocationData();

const updateArtistData = (geolocationData) => {
    if (geolocationData && geolocationData.address) {
        const lat = geolocationData.address.latitude;
        const lon = geolocationData.address.longitude;


        return { lat, lon };
    }


    return { lat: null, lon: null };
};

// ...

useEffect(() => {
    const { lat, lon } = updateArtistData(geolocationData);

    if (lat !== null && lon !== null) {
        setUserData(lat, lon);
        console.log('lat and lon', lat, lon);
    }
}, [geolocationData]);

const artistsWithDistance = useMemo(() => {
    if (artistData && artistData.data && geolocationData && geolocationData.address) {
        return artistData.data.map((artist) => {
            let artistLat = null;
            let artistLon = null;


            if (artist.location) {
                const locationArray = artist.location.split(',');
                artistLat = locationArray[0];
                artistLon = locationArray[1];
            }

            const distance = calculateDistance(userLat, userLon, artistLat, artistLon);
            const distance2 = Math.round(distance)
            console.log('artist lat and long', artistLat, artistLon);

            return { ...artist, distance2 };
        });
    }
    return [];
}, [artistData, geolocationData, userLat, userLon]);

    console.log(geolocationData);
    const [tattooStyle, setIsTattooStyle] = useState(false);
    const [selectedButtons, setSelectedButtons] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 750);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [artistId, setArtistSelect] = useState('');
    const [loading, setLoading] = useState(true);
    const [isArtistSaved, setIsArtistSaved] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = cookie.get('token');

                if (token) {
                    const { username, userId, artistIdNew, isUser, isArtist } = JSON.parse(token);
                    console.log(isArtist);
                    setUsername(username);

                    if (isUser === true) {
                        setIsUser(isUser);
                        setUserId(userId);
                    }
                    if (isArtist === true) {
                        setIsArtist(true);
                        setArtistId(artistIdNew);
                        console.log('afterwards' + artistIdNew);
                    }
                }

                if (artistIdNew) {
                    setIsArtist(true);
                    setArtistSelect(artistId);
                }

                const userResponse = await fetch('/api/user');

                if (!userResponse.ok) {
                    throw new Error(`Failed to fetch user data. Status: ${userResponse.status}`);
                }

                const userData2 = await userResponse.json();
                setUser(userData2);

                if (Array.isArray(userData2.data) && userData2.data.length > 0) {
                } else {
                    console.log('No user data available.');
                }
                console.log('user data', userData2)
                const artistResponse = await fetch('/api/artist');

                if (!artistResponse.ok) {
                    throw new Error(`Failed to fetch artist data. Status: ${artistResponse.status}`);
                }

                const artistData = await artistResponse.json();
                setArtistData(artistData);
                setIsLoggedIn(true);

                if (artistData) {
                    setSelectedArtist(artistData.data[0]);
                    console.log(artistData.data[0]);
                }

                if (Array.isArray(artistData.data) && artistData.data.length > 0) {
                } else {
                    console.log('No artist data available.');
                }

                setLoading(false);

                if (loading) {
                    return <p>Loading...</p>;
                }

                if (error) {
                    return <p>Error: {error}</p>;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };
        console.log('artistId check', artistIdNew);
        fetchData();
    }, [userId, setUserId, isUser, isArtist, artistIdNew]);

    useEffect(() => {
        if (selectedArtist && typeof selectedArtist === 'object') {
            console.log('Selected Artist ID:', selectedArtist._id);
        } else {
            console.log('No selected artist or not an object');
        }
    }, [selectedArtist]);

    useEffect(() => {
        console.log('testing use effect' + artistIdNew);
    }, [artistIdNew]);

    const changeButtonColor = (buttonName) => {
        setSelectedButtons((prevState) => ({
            ...prevState,
            [buttonName]: !prevState[buttonName],
        }));
    };

    async function tattooStyles() {
        setIsTattooStyle((prevState) => !prevState);
    }

    async function setSize() {
        setIsDesktop(window.innerWidth > 750);
    }

    useEffect(() => {
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    });

    const setArtist = (index) => {
        setSelectedArtist(artistData.data[index]);
    };

    useEffect(() => {
        console.log(selectedArtist);
    }, [selectedArtist]);

    const [artistStates, setArtistStates] = useState({});

    useEffect(() => {
        if (selectedArtist) {
            const artistId = selectedArtist._id;
            const isSaved = savedArtists.some(
                (artistGroup) =>
                    artistGroup.data &&
                    Array.isArray(artistGroup.data) &&
                    artistGroup.data.some((item) => item._id === artistId)
            );

            setArtistStates((prevStates) => ({
                ...prevStates,
                [artistId]: isSaved,
            }));
        }
    }, [selectedArtist, savedArtists]);

    const saveArtist = async (artistId, userId) => {
        try {
            const isSaved = artistStates[artistId];

            if (!isSaved) {
                console.log(savedArtists);
                const isArtistSaved = savedArtists.some(
                    (artist) =>
                        artist.data &&
                        Array.isArray(artist.data) &&
                        artist.data.some((item) => item._id === artistId)
                );

                console.log('isArtistSaved', isArtistSaved);
                setArtistStates((prevStates) => ({
                    ...prevStates,
                    [artistId]: true,
                }));

                console.log('Saving artist...');
                const res = await fetch(`/api/user/${userId}/savedArtists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artistId, userId }),
                });

                if (res.status === 201) {
                    setSavedArtists((prevSavedArtists) => [
                        ...prevSavedArtists,
                        { artistId, userId },
                    ]);

                    console.log('Artist added successfully');
                    setMessage('Artist added successfully');
                    setIsArtistSaved(true);
                } else {
                    console.error('Failed to save artist');
                    setMessage('Failed to save artist');
                }
            } else {
                console.log('Artist is already saved');
            }
        } catch (error) {
            console.error('Error saving artist:', error);
            setMessage('Error saving artist');
        }
    };

    console.log('testing' + artistIdNew);
    console.log('goelocation data' + geolocationData?.address.city)
    console.log('geolocation data' + geolocationData?.address.state)
    console.log

    return (
        <div style={{ marginLeft: '10px' }}>
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
                        {geolocationData?.address?.state}. Here's a list of
                        artists that are near you!
                    </div>

                    <div class="container" style={{ marginTop: '20px', marginBottom: '20px' }}>
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

                    {artistData && artistData.data && (
                        isDesktop ? (
                            <div className="container">
                                <div className="row">
                                    <h3>Click on each card to access artist profile pages!</h3>
                                    <div className="col-5">
                                        {error ? (
                                            <p>Error fetching artists: {error}</p>
                                        ) : (
                                            <ul style={{ padding: '0px' }}>
                                                {artistsWithDistance.map((item, index) => {

                                             

                                                    return (
                                                        <div key={index} onClick={() => setArtist(index)} className="card mt-4 d-flex justify-content-end">
                                                            <h3 className="custom-card-header">
                                                                {item.firstname} {item.lastname}
                                                            </h3>

                                                            <div style={{ borderRadius: '50%', border: '8px solid orange', overflow: 'hidden', width: 100, height: 100 }} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                                                <img src={item.profilePicture ? item.profilePicture : './placeholder.jpeg'} width={100} height={100} alt={`${item.firstname} ${item.lastname}`} />
                                                            </div>
                                                            <p>@{item.username}</p>
                                                       
                                                            <p>Distance: {item.distance2} miles </p>
                                                       
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
                                                                    style={{ width: '50%' }}
                                                                    className={`button ${savedArtists && savedArtists[item._id] ? 'selected' : ''}`}
                                                                    onClick={() => { setArtist(item._id), saveArtist(item._id, userId) }}
                                                                >
                                                                    {savedArtists && savedArtists[item._id] ? 'Saved Artist' : 'Save Artist'}
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    );
                                                    
                                                })}
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
                                                                    <img src={selectedArtist.profilePicture ? selectedArtist.profilePicture : './placeholder.jpeg'} width={100} height={100} alt={`${selectedArtist.firstname} ${selectedArtist.lastname}`} />
                                                                </div>
                                                                <div className="col-4">
                                                                    <ArtistDetails artistId={selectedArtist._id} userId={userId} />
                                                                </div>
                                                                <p>@{selectedArtist.username}</p>
                                                                <p>Distance: {selectedArtist.distance} miles </p>
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
                                                {artistData.data.map((item, index) => (
                                                    <div key={index} className="card m-4 d-flex justify-content-end">
                                                        <Link href="/artist/[artistId]" as={`/artist/${item._id}`}>
                                                            <h3 className="custom-card-header">
                                                                {item.firstname} {item.lastname}
                                                            </h3>
                                                            <div className="container column">
                                                                <div style={{ borderRadius: "50%", border: "8px solid orange", overflow: "hidden", width: 100, height: 100 }} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                                                    <img src={item.profilePicture ? item.profilePicture : './placeholder.jpeg'} width={100} height={100} alt={`${item.firstname} ${item.lastname}`} />

                                                                </div>

                                                            </div>
                                                            <p>@{item.username}</p>
                                                            <p>Distance: {item.distance} miles </p>
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
                                                                className={`button ${isArtistSaved ? 'selected' : ''}`}
                                                                onClick={() => saveArtist(item._id, userId)}
                                                            >
                                                                {isArtistSaved === true ? 'Saved Artist' : 'Save Artist'}
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
