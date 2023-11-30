import dbConnect from '../../../../config/db/utils/dbConnect';
import User from '../../../../models/User';


dbConnect();

export default async (req, res) => {

  const { method} = req;

  switch (method) {
    case 'GET':
      try {
        
        const userId = req.query.userId
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const userId = req.query.userId;
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ success: false, message: 'User or artist not found' });
        }

        const {profileUrls} = req.body
        console.log('req.body'+ profileUrls)

  
        user.profileUrl = profileUrls

        await user.save();

        res.status(201).json({ success: true, message: 'Artist saved successfully' });

      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
};
