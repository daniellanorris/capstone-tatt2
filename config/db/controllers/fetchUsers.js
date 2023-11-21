import axios from 'axios';

async function fetchUsers() {
  try {
    const response = await axios.get(`/api/user/`);
    const userData = response.data; 
    console.log(userData);
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export default fetchUsers;