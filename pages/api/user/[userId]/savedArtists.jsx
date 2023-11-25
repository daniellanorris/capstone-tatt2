import dbConnect from '../../../../config/db/utils/dbConnect';
import User from '../../../../models/User';
import Artist from '../../../../models/Artist';
import { deleteSavedArtist } from '../../../../config/db/controllers/savedArtistController';

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { artistId, userId} = req.body;
        const user = await User.findById(userId);
        const artist = await Artist.findById(artistId);
        console.log(artist)

        if (!user || !artistId) {
          return res.status(404).json({ success: false, message: 'User or artist not found' });
        }
``
        user.savedArtists.push(artist._id);
        await user.save();

        res.status(201).json({ success: true, message: 'Artist saved successfully' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;


    case 'GET':
      try {
        const {userId} = req.query
        const user = await User.findById(userId).populate('savedArtists');

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user.savedArtists });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

      case 'DELETE':
        try {
          const { artistId } = req.body;
          const result = await deleteSavedArtist(artistId); 
      
          if (result.success) {
            res.status(200).json({ success: true, message: result.message });
          } else {
            res.status(404).json({ success: false, message: result.message });
          }
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
        break;
  }
};
