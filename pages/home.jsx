
import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import GeoLocationData from '../components/geolocationData';
import ArtistDetails from '../components/parentLike';
import { calculateDistance } from '../config/db/controllers/findDistance';
import FilterDistance from '../config/db/controllers/filterDistance'


export default function Home({ onLoad }) {
    const [userData, setUser] = useState(null);
    const [artistData, setArtistData] = useState({ data: [] });
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [distanceFiltered, setDistance] = useState(10000)
    const [distanceTop, setDistanceTop] = useState(0)
    const [distanceSelect, setDistanceSelected] = useState(false)
    const [scrollDirection, setScrollDirection] = useState('down');
    const [scrollPosition, setScrollPosition] = useState(0);
    const { geolocationData } = GeoLocationData();
    const [isTattooStyle, setIsTattooStyle] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [artistId, setArtistSelect] = useState('');
    const [loading, setLoading] = useState(true);
    const [isArtistSaved, setIsArtistSaved] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState([])


    const [selectedButtons, setSelectedButtons] = useState({
        location: false,
        likes: false,
        tattoostyle: false,

    });

    const {
        userId,
        setUserId,
        isLoggedIn,
        isUser,
        isArtist,
        setArtistId,
        artistIdNew,
        setIsUser,
        setIsArtist,
        savedArtists,
        setSavedArtists,
        userLat,
        userLon,
        setUserData,
        selectedArtist,
        setSelectedArtist

    } = useUserData();



    const tattooStylesArray = [
        'American Traditional',
        'Japanese Traditional',
        'Fine-line',
        'Realistic',
        'Surrealist',
        'Blackwork',
        'Neo Traditional',
        'Watercolor',
        'Abstract',
        'New School',
        'Tribal',
        'Stick and Poke'
    ];

    useEffect(() => {

        onLoad();
    }, []);

    const filterByStyle = (style) => {
        if (!selectedButtons[style]) {
            setSelectedStyles((prevStyles) => [...prevStyles, style]);
        } else {
            setSelectedStyles((prevStyles) => prevStyles.filter((selectedStyle) => selectedStyle !== style));
        }
    };

    const updateArtistData = (geolocationData) => {
        if (geolocationData && geolocationData.address) {
            const lat = geolocationData.address.latitude;
            const lon = geolocationData.address.longitude;


            return { lat, lon };
        }


        return { lat: null, lon: null };
    };

    const { lat, lon } = updateArtistData(geolocationData);

    if (lat !== null && lon !== null) {
        setUserData(lat, lon);
    }

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


    const filterArtistsByTattooStyle = (artists, selectedStyles) => {
        return artists.filter((artist) => {
            const hasSelectedStyle = selectedStyles.length > 0;
            console.log(selectedStyles)
            const isTattooStyleFiltered = hasSelectedStyle && selectedStyles.some(style => artist.tattooStyle.includes(style));

            return (!hasSelectedStyle && !isTattooStyle) || isTattooStyleFiltered;
        });
    };

    const filterArtistsByDistance = (filteredArtists) => {
        if (distanceSelect) {
            return filteredArtists.filter((artist) => {
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
            });
        } else {
            return filteredArtists;
        }
    };

    const artistsWithDistance = useMemo(() => {
        if (artistData && artistData.data && geolocationData && geolocationData.address) {
            let filteredArtists = [...artistData.data];

            if (!isTattooStyle || Object.values(selectedButtons).some((isSelected) => isSelected)) {
                filteredArtists = filterArtistsByDistance(filteredArtists);
            }

            if (isTattooStyle && Object.values(selectedButtons).some((isSelected) => isSelected)) {
                filteredArtists = filterArtistsByTattooStyle(artistData.data, selectedStyles);
                filteredArtists = filterArtistsByDistance(filteredArtists)
            }

            return filteredArtists.map((artist) => {
                let artistLat = null;
                let artistLon = null;

                if (artist.location) {
                    const locationArray = artist.location.split(',');
                    artistLat = locationArray[0];
                    artistLon = locationArray[1];
                }

                const distance = calculateDistance(userLat, userLon, artistLat, artistLon);
                const distance2 = Math.round(distance);

                return { ...artist, distance2 };
            });
        }
        return [];
    }, [artistData, geolocationData, userLat, userLon, distanceFiltered, selectedButtons]);



    const tattooDistance = useMemo(() => {
        if (artistsWithDistance && isTattooStyle) {
            return artistsWithDistance.filter((artist) =>
                tattooStylesArray.some((style) => artist.tattooStyle.includes(style))
            );
        }


        return artistsWithDistance;
    }, [artistsWithDistance, isTattooStyle, selectedButtons]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsDesktop(window.innerWidth > 780);

            const handleResize = () => {
                setIsDesktop(window.innerWidth > 780);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);



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
            console.log(selectedArtist)

        } else {

        }
    }, [selectedArtist]);

    useEffect(() => {

    }, [artistIdNew]);



    const changeButtonColor = (buttonName) => {
        setSelectedButtons((prevButtons) => {
            const newButtons = { ...prevButtons, [buttonName]: !prevButtons[buttonName] };

            const hasSelectedStyle = Object.values(newButtons).some((isSelected) => isSelected);

            if (!hasSelectedStyle) {
                setIsTattooStyle(false);
                setDistanceSelected(false);
            }

            return newButtons;
        });
    };

    async function tattooStyles() {
        setIsTattooStyle((prevState) => !prevState);

    }


    const distances = () => {
        if (distanceSelect === false) {
            setDistanceSelected(true)
            setDistance(100)
            return
        }
        setDistanceSelected(false)
        setDistance(10000)



    }


    async function setSize() {
        setIsDesktop(window.innerWidth > 780);
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
    const cardTransform = scrollPosition > yLimitForCard ? 'translate(0%, 0%)' : 'translate(0%, -8%)';
    const cardTop = scrollPosition > yLimitForCard ? '' : distanceTop;
    const align = scrollPosition > yLimitForCard ? 'center' : '';
    const cardDisplay = scrollPosition > yLimitForCard ? 'flex' : '';


    return (
        <div style={{ marginLeft: '10px', position: 'relative', maxWidth: '100vw', marginBottom: "300px" }}>
            {isLoggedIn ? (
                <div>
                    <div>
                        <div style={{ position: 'relative', zIndex: 2000 }}>
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

                                        {isTattooStyle === true ? (
                                            <div className="pt-4">
                                                <h2>Select tattoo style(s)</h2>
                                                <div className="m-4 p-2">
                                                    {tattooStylesArray.map((style, index) => (
                                                        <button
                                                            key={index}
                                                            className={selectedButtons[style] ? 'selected' : ''}
                                                            onClick={() => {
                                                                changeButtonColor(style);
                                                                filterByStyle(style);
                                                            }}
                                                        >
                                                            {style}
                                                        </button>
                                                    ))}
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

                                                            <h3 style={{ color: "purple" }}>{item.distance2} miles away </h3>

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
                                            <div style={{ top: cardTop, position: cardPosition, width: '100%', transform: cardTransform }} className='fixed-card'>
                                                <div>
                                                    <div className="col-7" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                        <ul style={{ width: '100%', padding: "0px" }} >

                                                            {selectedArtist ? (
                                                                <div className={`card d-flex`} >
                                                                    <Link href="/artist/[artistId]" as={`/artist/${selectedArtist._id}`}>
                                                                        <h3 className="custom-card-header">
                                                                            {selectedArtist.firstname} {selectedArtist.lastname}
                                                                        </h3>
                                                                        <div className="row" style={{ maxWidth: "100%" }}>
                                                                            <div className="col-3">
                                                                                <div style={{ borderRadius: "50%", border: "8px solid orange", overflow: "hidden", width: 100, height: 100, zIndex: "2" }} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                                                                    <img src={selectedArtist.profilePicture ? selectedArtist.profilePicture : './placeholder.jpeg'} width={100} height={100} alt={`${selectedArtist.firstname} ${selectedArtist.lastname}`} />
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-7">
                                                                                {selectedArtist?.tattooStyle && selectedArtist?.tattooStyle.length > 0 && (
                                                                                    <h3>
                                                                                        {selectedArtist.tattooStyle
                                                                                            .filter(style => style !== null)
                                                                                            .map((style, index) => (
                                                                                                <span style={{ color: "purple" }} key={index}><em>{index > 0 ? ', ' : ''}{style}</em></span>
                                                                                            ))}
                                                                                    </h3>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-4">
                                                                            <ArtistDetails artistId={selectedArtist._id} userId={userId} />
                                                                        </div>
                                                                        <p>@{selectedArtist.username}</p>
                                                                        <h3 style={{ color: "purple" }}>{selectedArtist.distance2} miles away </h3>

                                                                        <div>
                                                                            <div className="row grid-big-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: "300px", overflowY: "auto" }}>
                                                                                {Object.values(selectedArtist.image).map((imageUrl, index) => (
                                                                                    <div key={index} className="col-1 mx-0 p-0 grid-container" style={{ textAlign: 'center' }}>
                                                                                        <img
                                                                                            src={imageUrl}
                                                                                            alt={`Image ${index}`}
                                                                                            className="img-fluid"
                                                                                            style={{ objectFit: 'cover' }}
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

                        ) : (<div className="container pt-4">
                            <div className="row justify-content-center">
                                <div className="col-md-8 text-center">
                                    {error ? (
                                        <p>Error fetching artists: {error}</p>
                                    ) : (
                                        <ul style={{ padding: "0px", width: "100%" }}>
                                            {artistsWithDistance.map((item, index) => (
                                                <div key={index} className="card m-4 center">
                                                    <Link href="/artist/[artistId]" as={`/artist/${item._id}`}>
                                                        <h3 className="custom-card-header">
                                                            {item.firstname} {item.lastname}
                                                        </h3>
                                                        <div style={{ borderRadius: '50%', border: '8px solid orange', overflow: 'hidden', width: 100, height: 100 }} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                                                <img src={item.profilePicture ? item.profilePicture : './placeholder.jpeg'} width={100} height={100} alt={`${item.firstname} ${item.lastname}`} />
                                                            </div>
                                                            <p>@{item.username}</p>

                                                        <h3 style={{ color: "purple" }}>{item.distance2} miles away </h3>
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