import dbConnect from '../../../utils/dbConnect'
import userSchema from '../../../models/User'

dbConnect()

export default async (req, res) => {
    const {method} = req;

    switch(method) {

        case 'GET':
            try {
                const users = await userSchema.find({});
                res.status(200).json({success: true, data: users})
            }
            catch(error) {
                res.status(400).json({success: false})
            }
            break;
    case 'POST':
        try {
            const user = await userSchema.create(req.body);

            res.status(201).json({success: true, data: user})
        }
        catch(error) {
            res.status(400).json({success: false})
        }

        break;


    }

}