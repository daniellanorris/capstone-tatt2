import React, { useEffect } from 'react';
import AWS from 'aws-sdk';
import { useUserData } from '../context/userContext';

const ProfileUploadForm = () => {
  const { selectedFile, setSelectedFile, setArtistProfileData, artistIdNew, artistProfileData } = useUserData();


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    AWS.config.update({
      accessKeyId: 'AKIAZJUT7CEXODUZBHF5',
      secretAccessKey: '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',
      region: 'us-east-1',
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
        console.log('S3 URL: ' + data.Location);

        // S3 URL for storage
        const s3Url = data.Location;

        console.log(s3Url);

        // Set S3 URL directly to the state
        setArtistProfileData(s3Url);

        // Send S3 URL to the API
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
          console.log('S3 URLs saved successfully in your API.');
        } else {
          console.error('Failed to save S3 URLs.');
        }
      })
      .catch((error) => {
        console.error('Error saving S3 URLs:', error);
      });
  };

  return (
    <div>
      <h2>Change Your Profile Picture</h2>
      <p>Select an image to update your profile picture!</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {artistProfileData && <img src={artistProfileData} alt="Uploaded Image" className="img-fluid mt-3" style={{ width: '100px' }} />}
    </div>
  );
};

export default ProfileUploadForm;