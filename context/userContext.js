import { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'js-cookie';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initialize userId with null
  const [isArtist, setIsArtist] = useState(null);
  const [isUser, setIsUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
      const { userId, isUser, isArtist, isLoggedIn} = JSON.parse(token);
      setUserId(userId);
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
    <UserContext.Provider value={{ userId, setUserId, isArtist, setIsArtist, isUser, setIsUser, setIsLoggedIn, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserData() {
  return useContext(UserContext);
}
