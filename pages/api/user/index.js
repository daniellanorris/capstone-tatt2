import dbConnect from '../../../config/db/utils/dbConnect'
import User from '../../../models/User'
import cookie from 'cookie'

dbConnect()

export default async (req, res) => {
    const {
        query: {id}, 
        method
    } = req;

    switch(method) {
        case 'GET': 

            try {
                const users = await User.find({});

                if(!users) {
                    return res.status(400).json({success: false})
                }

                res.status(200).json({success: true, data: users})
            }
            catch(error) {
                res.status(400).json('error:'+ error)
            }
            break;

        case 'POST':

            try {

                const existingUser = await User.findOne({ username: req.body.username });

                if (existingUser) {
                  return res.status(400).json({ success: false, message: 'Username already exists' });
                }

                const newUser = await User.create(req.body);
            
                if (!newUser) {
                  return res.status(400).json({ success: false, message: 'User creation failed' });
                }
            
                res.status(201).json({ success: true, data: newUser });

                res.setHeader("Set-Cookie", cookie.serialize("tokenUser", req.body.token, {
                    httpOnly: true, 
                    secure: "development", 
                    maxAge: 60 * 60, 
                    sameSite: "strict",
                    path: "/"
      
                  }))
              } catch (error) {
                res.status(500).json({ success: false, error: error.message });
              }
              break;

        case 'PUT':
            try {
                const user = await User.findByIdAndUpdate(id, req.body, {
                    new: true, 
                    runValidators: true
      
                })
    
                if(!user) {
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
            const deletedUser = await User.deleteOne({_id: id})

            if(!deletedUser) {
                return res.status(400).json({success: false})
            }

            res.status(200).json({success: true, data: deletedUser})

        }

        catch(error) {
            res.status(400).json({success: false})
        }
    }

}

