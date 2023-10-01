
import Artist from '../../../models/Artist';


// Function to save an artist to a user's savedArtists
export default async function saveTattoosToArtist() {
const artistId = req.query.artistId
const {name} = req.body

  try {

    const artist = await Artist.findById(artistId);

    if (!user || !artist) {
      return { success: false, message: 'User or artist not found' };
    }

    // Assuming you want to add the artist to the user's savedArtists
    artist.tattooStyles.push(name);
    await artist.save();

    return { success: true, message: 'Artist saved to user' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}