import axios from 'axios';

async function fetchUsers() {
  try {
    const response = await axios.get(`/api/user/`);
    const userData = response.data; // Assuming the data is an array of users
    console.log(userData);
    return userData;
  } catch (error) {
    // Handle error
    console.error('Error fetching user data:', error);
    return null;
  }
}

export default fetchUsers;