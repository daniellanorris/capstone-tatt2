import User from '../../../models/User';
import Artist from '../../../models/Artist';


export default async function saveArtistToUser() {
const userId = User._id
const artistId = Artist._id

  try {
    const user = await User.findById(userId);
    const artist = await Artist.findById(artistId);

    if (!user || !artist) {
      return { success: false, message: 'User or artist not found' };
    }

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

    user.savedArtists = user.savedArtists.filter((savedArtist) => savedArtist.toString() !== artistId.toString());

    await user.save();

    return { success: true, message: 'Saved artist deleted successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
