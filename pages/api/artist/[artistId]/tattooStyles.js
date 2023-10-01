import dbConnect from '../../../../config/db/utils/dbConnect';
import Artist from '../../../../models/Artist';
import TattooStyle from '../../../../models/Artist'; // Correct the import for the tattooStyles model



dbConnect();

export default async (req, res) => {
    const { method, body, query } = req;

    switch (method) {
        case 'GET':
            try {
                const artistId = req.query.artistId;
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
                    const { name } = req.body;
                    const artistId = req.query.artistId;
            
                    const artist = await Artist.findById(artistId);
            
                    if (!artist) {
                        return res.status(404).json({ success: false, message: 'Artist not found' });
                    }
            
                    // Create a new tattoo style
                    const newTattooStyle = new TattooStyle({ name });
            
                    await newTattooStyle.save();
            
                    // Push the new tattoo style's name into the artist's TattooStyle array
                    artist.TattooStyle.push(newTattooStyle.name);
            
                    await artist.save();
            
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
