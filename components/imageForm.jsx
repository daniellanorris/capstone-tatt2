import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { useUserData } from '../context/userContext';

const ImageUploadForm = () => {
  const { selectedFile, setSelectedFile, imageData, setImageData, artistIdNew} = useUserData();

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
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
      region: 'us-east-1',
    });
  
    const s3 = new AWS.S3();
  
    const params = {
      Bucket: 'tatt2-images',
      Key: `uploads/${Date.now()}-${selectedFile.name}`,
      Body: 
          selectedFile
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        alert('Image upload to S3 failed.');
      } else {
        alert('Image uploaded successfully.');
  
  
        // S3 URL for storage
        const s3Url = data.Location;
  
        // Client
        const imageUrl = URL.createObjectURL(selectedFile);
        setImageData(imageUrl);
  
        // Send the S3 URL to the API
        const imageUrls = [s3Url]; // Store the URL(s) in an array
        sendImageUrlsToAPI(imageUrls);
      }
    });
  };
  
  const sendImageUrlsToAPI = (imageUrls) => {
   
    fetch(`/api/artist/${artistIdNew}/images`, {
      method: 'POST',
      body: JSON.stringify({ imageUrls }), // Send the array of image URLs
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
    <div style={{maxWidth: "200px"}}>
      <h2>Image Upload</h2>
      <input type="file" onChange={handleFileChange} style={{maxWidth: "300px"}}/>
      <button onClick={handleUpload}>Upload Image</button>
      {imageData && <img src={imageData} alt="Uploaded Image" width="200px" height="auto"/>}
    </div>
  );
};

export default ImageUploadForm;
