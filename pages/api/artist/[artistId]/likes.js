import dbConnect from '../../../../config/db/utils/dbConnect';
import Artist from '../../../../models/Artist';


dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const {artistId} = req.body
                const artist = await Artist.findOne({artistId});
                console.log(artist)

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
                    const { userId, artistId } = req.body;
                    console.log('post values', artistId, userId)
            
                    const artist = await Artist.findOne({ _id: artistId });
                    console.log('artist test', artist)
            
                    if (!artist) {
                        return res.status(404).json({ success: false, message: 'Artist not found' });
                    }
            
                    await artist.incrementLikes(userId, artistId);
            
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

