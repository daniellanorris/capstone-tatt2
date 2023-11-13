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

  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
      setSavedArtists((savedArtistsArray) => savedArtistsArray || []);
      const { userId, isUser, isArtist, isLoggedIn, artistIdNew, savedArtists } = JSON.parse(token);
      setUserId(userId);
      setArtistId(artistIdNew);
      setIsLoggedIn(isLoggedIn);

      if (isArtist === true) {
        setIsArtist(true);
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
      try {
        const response = await fetch(`/api/artist/${artistIdNew}/profile`);
        const result = await response.json();

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

    if (artistIdNew) {
      fetchArtistData();
    }
  }, [setProfileData, artistIdNew]);

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
        setArtistProfileData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserData() {
  return useContext(UserContext);
}
