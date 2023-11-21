import axios from 'axios';

async function fetchArtists() {
  try {
    const response = await axios.get(`/api/artist/`);
    const artistData = response.data; 
    console.log(artistData);
    return artistData;
  } catch (error) {
    console.error('Error fetching artist data:', error);
    return null;
  }
}

export default fetchArtists;