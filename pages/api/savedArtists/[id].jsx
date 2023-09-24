import dbConnect from '../../../utils/dbConnect';
import savedArtists from '../../../models/savedArtists';
import axios from 'axios';

dbConnect();

async function fetchArtistsFromInternalEndpoint() {
    try {
        const response = await axios.get('/api/artist'); // Use a relative path to your internal API
        return response.data; // Assuming the data is in JSON format and contains an array of artists
    } catch (error) {
        console.error('Error fetching artists from internal endpoint:', error);
        return null;
    }
}

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const artistsData = await fetchArtistsFromInternalEndpoint();
                if (!artistsData) {
                    return res.status(400).json({ success: false, message: 'Invalid data from internal endpoint' });
                }

                const artistIds = artistsData.map((artist) => artist._id);

                res.status(200).json({ success: true, data: artistIds });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Error fetching and processing artists' });
            }
            break;

            case 'POST':

                try {
                    const artist = await savedArtists.create(id, req.body, {
                        new: true, 
                        runValidators: true
          
                    })
        
                    if(!artist) {
                        return res.status(400).json({success: false})
                    }
        
                    res.status(200).json({success: true})
                }
        
                catch(error) {
                    res.status(400).json({success: false})
                }
                case 'PUT':
                    try {
                        const artist = await savedArtists.findByIdAndUpdate(id, req.body, {
                            new: true, 
                            runValidators: true
              
                        })
            
                        if(!artist) {
                            return res.status(400).json({success: false})
                        }
            
                        res.status(200).json({success: true})
                    }
            
                    catch(error) {
                        res.status(400).json({success: false})
                    }
                break;
        
                case 'DELETE': 
                
                try {
                    const deletedArtist = await savedArtists.deleteOne({_id: id})
        
                    if(!deletedArtist) {
                        return res.status(400).json({success: false})
                    }
        
                    res.status(200).json({success: true, data: deletedArtist})
        
                }
        
                catch(error) {
                    res.status(400).json({success: false})
                }
            
        default:
            res.status(400).json({ success: false, message: 'Invalid method' });
            break;
    }
};
