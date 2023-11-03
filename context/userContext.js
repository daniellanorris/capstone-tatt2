import { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'js-cookie';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); 
  const [artistIdNew, setArtistId] = useState(null)
  const [isArtist, setIsArtist] = useState(null);
  const [isUser, setIsUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [savedArtists, setSavedArtists] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageData, setImageData] = useState(null); 

  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
      const { userId, isUser, isArtist, isLoggedIn, artistIdNew} = JSON.parse(token);
      setUserId(userId);
      setArtistId(artistIdNew);
      setIsLoggedIn(isLoggedIn)
      if(isArtist === true) {
        setIsArtist(true)
      }
      if(isUser === true) {
        setIsUser(true)
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, isArtist, setIsArtist, isUser, setIsUser, setIsLoggedIn, isLoggedIn, savedArtists, setSavedArtists, artistIdNew, setArtistId, setSelectedFile, selectedFile, imageData, setImageData  }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserData() {
  return useContext(UserContext);
}
