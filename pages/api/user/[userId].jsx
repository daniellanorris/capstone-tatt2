import dbConnect from '../../../config/db/utils/dbConnect'
import User from '../../../models/User'
import fetchArtists from '../../../config/db/controllers/fetchArtists';

dbConnect()


export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

    switch (method) {
        case 'GET':

            try {
                const user = await User.findById(id);

                if (!user) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ success: true, data: user })

                const artists = await fetchArtists()

                if (!artists) {
                    res.status(400).json({ success: false })
                }

                res.status(200).json({ success: true, data: artists })

                const userDataWithArtists = {
                    user,
                    artists: artistsData
                };

                res.json({ data: userDataWithArtists })
            }
            catch (error) {
                res.status(400).json('error:' + error)
            }
            break;

        case 'PUT':
            try {
                const userId = req.query.userId
                const user = await User.findByIdAndUpdate(userId, req.body, {
                    new: true,
                    runValidators: true

                })

                if (!user) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ success: true, data: user })
            }

            catch (error) {
                res.status(400).json({ success: false })
            }
            break;

        case 'DELETE':
            try {
                const id = req.query.userId
                const deletedUser = await User.deleteOne({ _id: id });

                if (!deletedUser) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                res.status(200).json({ success: true, data: deletedUser });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Invalid method' });
            break;
    }
};