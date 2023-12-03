import React, { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'js-cookie';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [artistIdNew, setArtistId] = useState(null);
  const [isArtist, setIsArtist] = useState(null);
  const [isUser, setIsUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [savedArtists, setSavedArtists] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [artistProfileData, setArtistProfileData] = useState(null)
  const [tattooStyles, setTattooStyles] = useState([])
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const setUserData = (lat, lon) => {
    setUserLat(lat);
    setUserLon(lon);
  };



  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
     
      
      const { userId, isUser, isArtist, isLoggedIn, artistIdNew} = JSON.parse(token);
      setUserId(userId);
      setIsLoggedIn(isLoggedIn);


      if (isArtist) {
        setIsArtist(true)
        setArtistId(artistIdNew);
        setTattooStyles(tattooStyles)
      }
      if (isUser === true) {
        setIsUser(true);
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/images`);
        const result = await response.json();

        if (result.success && typeof result.data === 'object') {
          const profileUrl = result.data.profileUrl;


          if (profileUrl) {
            setProfileData(profileUrl);
          } else {
            setProfileData(null);
          }
        } else {
          console.error('Invalid API response:', result);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const fetchSavedArtists = async () => {
    try {
        if (userId) {
            const savedArtistsResponse = await fetch(`/api/user/${userId}/savedArtists`);

            if (!savedArtistsResponse.ok) {
                throw new Error(`Failed to fetch saved artists data. Status: ${savedArtistsResponse.status}`);
            }

            const savedArtistsData = await savedArtistsResponse.json();

            setSavedArtists((prevSavedArtists) => {
                const newArray = Array.isArray(prevSavedArtists) ? [...prevSavedArtists] : [];
                return newArray.concat(savedArtistsData);
            });
        }
    } catch (err) {
        console.log(err);
    }
};


    if (userId) {
      fetchUserData();
      fetchSavedArtists()
      
    }
  }, [setProfileData, userId, setSavedArtists]);

  useEffect(() => {
    const fetchArtistData = async () => {

      if (artistIdNew !== null) {
      setArtistId(artistIdNew)
      try {
        const response = await fetch(`/api/artist/${artistIdNew}/profile`);
        const result = await response.json();


        if (result.success && typeof result.data === 'object') {
          const profileUrl = result.data.profilePicture;
          
          if (profileUrl) {
            setArtistProfileData(profileUrl);
          } else {
            setArtistProfileData(null);
          }
        } else {
          console.error('Invalid API response:', result);
        }
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };
    
  }


      fetchArtistData();

  }, [setArtistProfileData, artistIdNew]);

  useEffect(() => {
    const fetchTattooStyles = async () => {
      if (artistIdNew) {
      try {
        const response = await fetch(`/api/artist/${artistIdNew}`);
        const result = await response.json();

        if (result.success && typeof result.data === 'object') {
          const tattooList = result.data.tattooStyles;

          if (profileUrl) {
            setTattooStyles(tattooList);
          } else {
            setTattooStyles([]);
          }
        } else {
          console.error('Invalid API response:', result);
        }
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };
  }

      fetchTattooStyles();

  }, [setTattooStyles]);

  return (
    <UserContext.Provider
      value={{
        selectedArtist, 
        setSelectedArtist,
        userId,
        setUserId,
        isArtist,
        setIsArtist,
        isUser,
        setIsUser,
        setIsLoggedIn,
        isLoggedIn,
        savedArtists,
        setSavedArtists,
        artistIdNew,
        setArtistId,
        setSelectedFile,
        selectedFile,
        imageData,
        setImageData,
        profileData,
        setProfileData,
        artistProfileData, 
        setArtistProfileData, 
        tattooStyles, 
        setTattooStyles, 
        userLat, 
        userLon, 
        setUserData

      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserData() {
  return useContext(UserContext);
}
