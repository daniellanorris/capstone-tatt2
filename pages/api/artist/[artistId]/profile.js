import dbConnect from '../../../../config/db/utils/dbConnect';
import Artist from '../../../../models/Artist';


dbConnect();

export default async (req, res) => {
  const { method} = req;

  switch (method) {
    case 'GET':
      try {
        const artistId = req.query.artistId
        const artist = await Artist.findById(artistId);

        if (!artist) {
          return res.status(404).json({ success: false, message: 'Artist not found' });
        }

        res.status(200).json({ success: true, data: artist });
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
      case 'POST':
      try {
        const artistId = req.query.artistId;
        const artist = await Artist.findById(artistId);

        if (!artist) {
          return res.status(404).json({ success: false, message: 'User or artist not found' });
        }

        const {profileUrls} = req.body

  
        artist.profilePicture = profileUrls

        await artist.save();

        res.status(201).json({ success: true, message: 'Artist saved successfully' });

      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
};
