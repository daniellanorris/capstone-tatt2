import dbConnect from '../../../../config/db/utils/dbConnect';
import Artist from '../../../../models/Artist';
import Image from '../../../../models/Image'
import AWS from 'aws-sdk';
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const artistId = req.query.artistId
        const artist = await Artist.findById(artistId);

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
        const artistId = req.query.artistId;
        const artist = await Artist.findById(artistId);

        if (!artist) {
          return res.status(404).json({ success: false, message: 'User or artist not found' });
        }

        const { imageUrls } = req.body;



        const imageDocuments = imageUrls.map((imageUrl) => new Image({ imageURL: imageUrl }));

        const savedImages = await Image.insertMany(imageDocuments);


        const imageURLS = savedImages.map((image) => image.imageURL);


        artist.image = artist.image.concat(imageURLS);


        await artist.save();

        res.status(201).json({ success: true, message: 'Artist saved successfully' });

      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      case 'DELETE':
        try {
          const artistId = req.query.artistId;
          const imageId = req.query.imageUrl;
      
          const artist = await Artist.findById(artistId);
          console.log('deleted' + artist)
      
          if (!artist) {
            return res.status(404).json({ success: false, message: 'Artist not found' });
          }
      
          const deletedImage = await Image.findOneAndDelete(imageId);
          console.log('deletedImage' + deletedImage)
      
          if (!deletedImage) {
            return res.status(404).json({ success: false, message: 'Image not found' });
          }
      
          AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET,
      region: 'us-east-1',
          });
      
          const s3 = new AWS.S3();
          const s3Key = deletedImage.imageURL;
          const s3Params = {
            Bucket: 'tatt2-images',
            Key: `uploads/${s3Key}`,
          };
      
          await s3.deleteObject(s3Params).promise(); // Use promise to make it asynchronous
      
          console.log('Deleted from S3 successfully:', s3Key);
      
          artist.image = artist.image.filter((imageUrl) => imageUrl === deletedImage.imageURL);
          console.log(artist.image);
      
          await artist.save();
          res.status(200).json({ success: true, data: artist });
        } catch (s3Err) {
          console.error('Error deleting from S3:', s3Err);
          res.status(500).json({ success: false, error: 'Error deleting from S3' });
        }
        break;
      

    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
};
