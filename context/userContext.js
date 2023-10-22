import { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'js-cookie';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initialize userId with null

  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
      const { userId } = JSON.parse(token);
      setUserId(userId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserData() {
  return useContext(UserContext);
}
