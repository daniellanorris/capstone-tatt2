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


  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
     
      
      const { userId, isUser, isArtist, isLoggedIn, artistIdNew, savedArtists } = JSON.parse(token);
      setUserId(userId);

      setSavedArtists((savedArtistsArray) => savedArtistsArray || []);
      setIsLoggedIn(isLoggedIn);


      if (isArtist === true) {
        setIsArtist(true);
        setArtistId(artistIdNew);
        console.log(artistIdNew)
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

    if (userId) {
      fetchUserData();
    }
  }, [setProfileData, userId]);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (artistIdNew !== null) {
      try {
        console.log(artistIdNew)
        const response = await fetch(`/api/artist/${artistIdNew}/profile`);
        const result = await response.json();
        console.log('artistid from context'+ artistIdNew)

        if (result.success && typeof result.data === 'object') {
          const profileUrl = result.data.profilePicture;
          console.log('profileUrl' + profileUrl)
          
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
        console.log('artistid from context'+ artistIdNew)

        if (result.success && typeof result.data === 'object') {
          const tattooList = result.data.tattooStyles;
          console.log('profileUrl' + tattooStyles)

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

  }, [setTattooStyles, artistIdNew]);

  return (
    <UserContext.Provider
      value={{
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
        setTattooStyles
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserData() {
  return useContext(UserContext);
}
