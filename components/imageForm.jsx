import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { useUserData } from '../context/userContext';


console.log(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID)
console.log(process.env.REACT_APP_AWS_ACCESS_KEY_ID)


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
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey:process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
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
      <input type="file" onChange={handleFileChange} className="form-control mb-3" style={{maxWidth: "300px"}}/>
      <button className="btn btn-primary" onClick={handleUpload}>Upload Image</button>
      {imageData && <img src={imageData} alt="Uploaded Image" className="img-fluid mt-3" width="200px" height="auto"/>}
    </div>
  );
};

export default ImageUploadForm;
