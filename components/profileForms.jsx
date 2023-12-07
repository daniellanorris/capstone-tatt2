import React, { useEffect } from 'react';
import AWS from 'aws-sdk';
import { useUserData } from '../context/userContext';
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const ProfileUploadForm = () => {
  const { selectedFile, setSelectedFile, setArtistProfileData, artistIdNew, artistProfileData } = useUserData();


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey:process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: 'tatt2-images',
      Key: `uploads/profile-${Date.now()}-${selectedFile.name}`,
      Body: selectedFile,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        alert('Profile Picture upload failed.');
      } else {
        alert('Image uploaded successfully.');

        const s3Url = data.Location;

        setArtistProfileData(s3Url);

        sendProfileUrlsToAPI(s3Url);
      }
    });
  };

  const sendProfileUrlsToAPI = (profileUrls) => {
    fetch(`/api/artist/${artistIdNew}/profile`, {
      method: 'POST',
      body: JSON.stringify({ profileUrls }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {

        } else {
          console.error('Failed to save S3 URLs.');
        }
      })
      .catch((error) => {
        console.error('Error saving S3 URLs:', error);
      });
  };

  return (
    <div iv style={{ maxWidth: "200px" }}>
      <input type="file" onChange={handleFileChange} className="form-control mb-3" style={{ maxWidth: "300px" }} />
      <button onClick={handleUpload}>Upload Image</button>

      {artistProfileData && <img src={artistProfileData} alt="Uploaded Image" className="img-fluid mt-3" style={{ width: '100px' }} />}
    </div>
  );
};

export default ProfileUploadForm;
