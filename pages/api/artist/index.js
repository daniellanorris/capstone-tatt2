import dbConnect from '../../../config/db/utils/dbConnect'
import Artist from '../../../models/Artist'
import cookie from 'cookie'
import bcrypt from 'bcrypt'

dbConnect()

export default async (req, res) => {
  const {
    body: {artistId}, 
    method
} = req;


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
    const { username, password, ...otherData } = req.body;  // Destructure the request body

    const existingArtist = await Artist.findOne({ username });

    if (existingArtist) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new artist with hashed password
    const newArtist = await Artist.create({ username, password: hashedPassword, ...otherData });

    if (!newArtist) {
      return res.status(400).json({ success: false, message: 'User creation failed' });
    }

    const artistId = newArtist._id;
    res.status(201).json({ success: true, data: artistId });

    res.setHeader("Set-Cookie", cookie.serialize("tokenArtist", req.body.token, {
      httpOnly: true,
      secure: "development",
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/"
    }));
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
  break;

            }            


}