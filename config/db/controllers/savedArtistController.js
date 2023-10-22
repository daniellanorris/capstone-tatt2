import User from '../../../models/User';
import Artist from '../../../models/Artist';


// Function to save an artist to a user's savedArtists
export default async function saveArtistToUser() {
const userId = User._id
const artistId = Artist._id

  try {
    const user = await User.findById(userId);
    const artist = await Artist.findById(artistId);

    if (!user || !artist) {
      return { success: false, message: 'User or artist not found' };
    }

    // Assuming you want to add the artist to the user's savedArtists
    user.savedArtists.push(artist._id);
    await user.save();

    return { success: true, message: 'Artist saved to user' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteSavedArtist(userId, artistId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }
    const index = user.savedArtists.indexOf(artistId);
    if (index === -1) {
      return { success: false, message: 'Saved artist not found in user\'s list' };
    }

    user.savedArtists.splice(index, 1);

    await user.save();

    return { success: true, message: 'Saved artist deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
