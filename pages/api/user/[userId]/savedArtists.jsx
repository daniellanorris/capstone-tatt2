import dbConnect from '../../../../config/db/utils/dbConnect';
import User from '../../../../models/User';
import Artist from '../../../../models/Artist';

dbConnect();

export default async (req, res) => {
  const { method } = req;
  const { userId } = req.query;

  switch (method) {
    case 'POST':
      try {
        const { artistId } = req.body;
        const user = await User.findById(userId);
        const artist = await Artist.findById(artistId);

        if (!user || !artistId) {
          return res.status(404).json({ success: false, message: 'User or artist not found' });
        }

        // Create a savedArtist entry for the user
        user.savedArtists.push(artist._id);
        await user.save();

        res.status(201).json({ success: true, message: 'Artist saved successfully' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;


    case 'GET':
      try {
        const user = await User.findById(userId).populate('savedArtists');

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user.savedArtists });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { savedArtistId } = body;
        const result = await updateSavedArtist(savedArtistId, body);

        if (result.success) {
          res.status(200).json({ success: true, message: result.message });
        } else {
          res.status(404).json({ success: false, message: result.message });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { savedArtistId } = body;
        const result = await deleteSavedArtist(savedArtistId);

        if (result.success) {
          res.status(200).json({ success: true, message: result.message });
        } else {
          res.status(404).json({ success: false, message: result.message });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
};
