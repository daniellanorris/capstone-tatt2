import dbConnect from '../../../utils/dbConnect'
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
                const artist = await Artist.findById(id);

                if(!artist) {
                    return res.status(400).json({success: false})
                }

                res.status(200).json({success: true, data: artist})
            }
            catch(error) {
                res.status(400).json('error:'+ error)
            }
            break;

        case 'POST':

        try {
            const artist = await Artist.create(id, req.body, {
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
                const artist = await Artist.findByIdAndUpdate(id, req.body, {
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
            const deletedArtist = await Artist.deleteOne({_id: id})

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

