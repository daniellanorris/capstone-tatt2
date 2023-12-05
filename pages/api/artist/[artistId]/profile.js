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
            const artistId = req.query.artistId; // Obtain artistId correctly
            const artist = await Artist.findById(artistId);
    
            if (!artist) {
                return res.status(404).json({ success: false, message: 'Artist not found' });
            }
    
            const { style } = req.body; 
    
            if (!style) {
                return res.status(400).json({ success: false, message: 'Missing required field: style' });
            }
    
            artist.tattooStyle.push(style);
    
            await artist.save();
            console.log(artist);
            res.status(201).json({ success: true, data: artist });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
        break;
    

    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
};
