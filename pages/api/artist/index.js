import dbConnect from '../../../utils/dbConnect'
import Artist from '../../../models/Artist'

dbConnect()

export default async (req, res) => {
    const {method} = req;

    switch(method) {

        case 'GET':
            try {
                const artists = await Artist.find({});
                res.status(200).json({success: true, data: artists})
            }
            catch(error) {
                res.status(400).json({success: false})
            }
            break;
    case 'POST':
        try {
            const artist = await Artist.create(req.body);

            res.status(201).json({success: true, data: artist})
        }
        catch(error) {
            res.status(400).json({success: false})
        }

        break;


    }


}

