import axios from 'axios';

async function fetchArtists() {
  try {
    const response = await axios.get(`/api/artist/`);
    const artistData = response.data; // Assuming the data is an array of artists
    console.log(artistData);
    return artistData;
  } catch (error) {
    // Handle error
    console.error('Error fetching artist data:', error);
    return null;
  }
}

export default fetchArtists;