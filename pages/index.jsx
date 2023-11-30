
import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import GeoLocationData from '../components/geolocationData';
import ArtistDetails from '../components/parentLike';
import { calculateDistance } from '../config/db/controllers/findDistance';
import FilterDistance from '../config/db/controllers/filterDistance'


export default function Home() {
    const [userData, setUser] = useState(null);
    const [artistData, setArtistData] = useState({ data: [] });
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [distanceFiltered, setDistance] = useState(100)
    const [distanceTop, setDistanceTop] = useState(0)
    const [distanceSelect, setDistanceSelected] = useState(false)
    const [scrollDirection, setScrollDirection] = useState('down');
    const [scrollPosition, setScrollPosition] = useState(0);

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

    const { geolocationData } = GeoLocationData();

    const updateArtistData = (geolocationData) => {
        if (geolocationData && geolocationData.address) {
            const lat = geolocationData.address.latitude;
            const lon = geolocationData.address.longitude;


            return { lat, lon };
        }


        return { lat: null, lon: null };
    };

    // checking for top of the dark card component
    useEffect(() => {
        const containerHeight = () => {
            const darkCardContainer = document.querySelector('.dark-card');
            if (darkCardContainer) {
                const rect = darkCardContainer.getBoundingClientRect();
                const distanceFromTop = rect.top + window.scrollY;
                console.log('Distance from Top:', distanceFromTop);
                setDistanceTop(distanceFromTop);
            }
        };

        containerHeight();

        const handleResize = () => {
            containerHeight();
        };

        window.addEventListener('resize', handleResize);


        const observer = new MutationObserver(containerHeight);

        const darkCardContainer = document.querySelector('.dark-card');
        if (darkCardContainer) {
            observer.observe(darkCardContainer, { attributes: true, childList: true, subtree: true });
        }


    }, [distanceTop]);


    useEffect(() => {
        const { lat, lon } = updateArtistData(geolocationData);

        if (lat !== null && lon !== null) {
            setUserData(lat, lon);

        }
    }, [geolocationData]);

    const artistsWithDistance = useMemo(() => {
        if (artistData && artistData.data && geolocationData && geolocationData.address) {
            return artistData.data
                .filter((artist) => {
                    let artistLat = null;
                    let artistLon = null;

                    if (artist.location) {
                        const locationArray = artist.location.split(',');
                        artistLat = locationArray[0];
                        artistLon = locationArray[1];
                    }

                    const distance = calculateDistance(userLat, userLon, artistLat, artistLon);
                    const distance2 = Math.round(distance);


                    return distance2 <= distanceFiltered;
                })
                .map((artist) => {
                    let artistLat = null;
                    let artistLon = null;


                    if (artist.location) {
                        const locationArray = artist.location.split(',');
                        artistLat = locationArray[0];
                        artistLon = locationArray[1];
                    }

                    const distance = calculateDistance(userLat, userLon, artistLat, artistLon);
                    const distance2 = Math.round(distance)

                    return { ...artist, distance2 };
                });
        }
        return [];
    }, [artistData, geolocationData, userLat, userLon, distanceFiltered]);

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
                    setUsername(username);

                    if (isUser === true) {
                        setIsUser(isUser);
                        setUserId(userId);
                    }
                    if (isArtist === true) {
                        setIsArtist(true);
                        setArtistId(artistIdNew);
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
                }

                const artistResponse = await fetch('/api/artist');

                if (!artistResponse.ok) {
                    throw new Error(`Failed to fetch artist data. Status: ${artistResponse.status}`);
                }

                const artistData = await artistResponse.json();
                setArtistData(artistData);
             

                if (artistData) {
                    setSelectedArtist(artistData.data[0]);

                }

                if (Array.isArray(artistData.data) && artistData.data.length > 0) {
                } else {

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

        fetchData();
    }, [userId, setUserId, isUser, isArtist, artistIdNew]);

    useEffect(() => {
        if (selectedArtist && typeof selectedArtist === 'object') {

        } else {

        }
    }, [selectedArtist]);

    useEffect(() => {

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
        const selectedArtistInFiltered = artistsWithDistance[index];
        setSelectedArtist(selectedArtistInFiltered);
    };

    useEffect(() => {
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

                const isArtistSaved = savedArtists.some(
                    (artist) =>
                        artist.data &&
                        Array.isArray(artist.data) &&
                        artist.data.some((item) => item._id === artistId)
                );

                setArtistStates((prevStates) => ({
                    ...prevStates,
                    [artistId]: true,
                }));


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


                    setMessage('Artist added successfully');
                    setIsArtistSaved(true);
                } else {
                    console.error('Failed to save artist');
                    setMessage('Failed to save artist');
                }
            } else {

            }
        } catch (error) {
            console.error('Error saving artist:', error);
            setMessage('Error saving artist');
        }
    };


    const handleFilterDistance = (value) => {
        setDistance(value)


    };

    const distances = () => {
        if (distanceSelect === false) {
            setDistanceSelected(true)
            return
        }
        setDistanceSelected(false)


    }



    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const yLimitForCard = distanceTop;

    const cardPosition = scrollPosition > yLimitForCard / 4 ? 'sticky' : 'sticky';
    const cardTransform = scrollPosition > yLimitForCard? 'translate(0%, 0%)' : 'translate(0%, -8%)';
    const cardTop = scrollPosition > yLimitForCard ? '' : distanceTop;
    const align = scrollPosition > yLimitForCard? 'center' : '';
    const cardDisplay = scrollPosition > yLimitForCard ? 'flex' : '';


    return (
        <div style={{ marginLeft: '10px', position: 'relative', maxWidth: '100vw' }}>
            {isLoggedIn ? (
                <div>
                    <div>
                        <div  style={{position: 'relative', zIndex: 2000 }}>
                            <h1>Home</h1>
                            <h2>Welcome, {username}</h2>

                            <h3>
                                Hey friend! It looks like you are in {geolocationData?.address?.city},{' '}
                                {geolocationData?.address?.state}. You can browse artists near here, or not!
                            </h3>

                            <div className="container" style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <div className="row">
                                    <div className="col-12 d-flex align-items-center justify-content-center">
                                        <button
                                            className={selectedButtons['location'] ? 'selected' : ''}
                                            onClick={() => {
                                                changeButtonColor('location');
                                                distances();
                                            }}
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


                                        {tattooStyle === true ? (
                                            <div className="pt-4">
                                                <h2> Select tattoo style(s) </h2>
                                                <div className="m-4 p-2">
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
                                            </div>
                                        ) : null}
                                    </div>

                                </div>
                                {distanceSelect === true ? (
                                    <div style={{ borderRadius: "30px" }} className="mt-3">
                                        <FilterDistance onFilterDistance={handleFilterDistance} />
                                    </div>
                                ) : (null)
                                }
                            </div>
                            </div>
                        </div>

                        {artistData && artistData.data && (
                            isDesktop ? (
                                <div className="container pt-4">
                                    <div className="row">
                                        <div className="col-5">
                                            {error ? (
                                                <p>Error fetching artists: {error}</p>
                                            ) : (
                                                <ul style={{ padding: '0px' }}>
                                                    {artistsWithDistance.map((item, index) => {



                                                        return (
                                                            <div key={index} onClick={() => setArtist(index)} className={`mt-4 d-flex justify-content-end ${(selectedArtist._id === item._id) ? 'card-selected card' : 'card '}`}>
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
                                        <div className="col-7 mt-4 dark-card container" style={{ maxWidth: '100vw', display: cardDisplay, justifyContent: 'center' }}>
                                            <div className="col-7 mt-4 " style={{ position: "sticky", width: '100%' }}>
                                                <div style={{top: cardTop, position: cardPosition, width: '100%', transform: cardTransform}} className='fixed-card'>
                                                    <div>
                                                        <div className="col-7" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                                            <ul style={{ width: '100%', padding: "0px"}} >

                                                                {selectedArtist ? (
                                                                    <div className={`card d-flex`} >
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
                                                                            <p>Distance: {selectedArtist.distance2} miles </p>
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
                                                                            <div>
                                                                                <div className="row">
                                                                                    {Object.values(selectedArtist.image).map((imageUrl, index) => (
                                                                                        <div key={index} className="col-3 mx-0">
                                                                                            <img
                                                                                                src={imageUrl}
                                                                                                alt={`Image ${index}`}
                                                                                                className="img-fluid"
                                                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                                            />
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
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

                                                </div>



                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ) : (
                                <div className="container pt-4">
                                    <div className="row">
                                        <div className="col-10">
                                            {error ? (
                                                <p>Error fetching artists: {error}</p>
                                            ) : (
                                                <ul style={{ padding: "0px" }}>
                                                    {artistsWithDistance.map((item, index) => (
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