import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { useUserData } from '../context/userContext';

const ProfileUploadForm = () => {
  const { selectedFile, setSelectedFile, profileData, setProfileData, artistIdNew} = useUserData();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
  
    AWS.config.update({
      accessKeyId: 'AKIAZJUT7CEXODUZBHF5',
      secretAccessKey: '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',
      region: 'us-east-1',
    });
  
    const s3 = new AWS.S3();
  
    const params = {
      Bucket: 'tatt2-images',
      Key: `uploads/profile-${Date.now()}-${selectedFile.name}`,
      Body: 
          selectedFile
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

        console.log(s3Url)
  
        // Client
        const profileUrl = URL.createObjectURL(selectedFile);
        setProfileData(profileUrl);

        
        const profileUrls = s3Url; 
        sendProfileUrlsToAPI(profileUrls);
       
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
      <p> Select an image to update your profile picture!</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {profileData && <img src={profileData} alt="Uploaded Image" width="500" height="auto"/>}
    </div>
  );
};


export default ProfileUploadForm;