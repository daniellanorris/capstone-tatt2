import dbConnect from '../../../config/db/utils/dbConnect'
import Artist from '../../../models/Artist'

dbConnect()

export default async (req, res) => {
    const {
        query: {id}, 
        method
    } = req;

    switch(method) {
        case 'GET': 

            try {
                const artistId = req.query.artistId
                const artist = await Artist.findById(artistId);

                if(!artist) {
                    return res.status(400).json({success: false})
                }

                res.status(200).json({success: true, data: artist})
            }
            catch(error) {
                res.status(400).json('error:'+ error)
            }
            break;

        case 'PUT':
            try {
                const artistId = req.query.artistId; 
                const artist = await Artist.findByIdAndUpdate(artistId, req.body, {
                  new: true, 
                  runValidators: true,
                });
            
                if (!artist) {
                  return res.status(404).json({ success: false, message: 'Artist not found' });
                }
            
                res.status(200).json({ success: true, data: artist });
              } catch (error) {
                res.status(500).json({ success: false, error: error.message });
              }
              break;
            
        case 'DELETE': 
        
        try {
            const id = req.query.artistId
            const deletedArtist = await Artist.deleteOne({ _id: id })

            if(!deletedArtist) {
                return res.status(400).json({success: false})
            }

            res.status(200).json({success: true, data: deletedArtist})

        }

        catch(error) {
            res.status(400).json({success: false})
        }
    }

}

