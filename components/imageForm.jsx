import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { useUserData } from '../context/userContext';

const ImageUploadForm = () => {
  const { selectedFile, setSelectedFile, imageData, setImageData } = useUserData();
  const { artistIdNew } = useUserData();
 

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
      Key: `uploads/${Date.now()}-${selectedFile.name}`,
      Body: selectedFile,
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        alert('Image upload to S3 failed.');
      } else {
        alert('Image uploaded successfully.');
  
        console.log('S3 URL: ' + data.Location);
  
        // s3 for storage
        const s3Url = data.Location;
  
        // client
        const imageUrl = URL.createObjectURL(selectedFile);
        setImageData(imageUrl);
  
        fetch(`/api/artist/${artistIdNew}/images`, {
          method: 'POST',
          body: JSON.stringify({ s3Url }), 
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              console.log('S3 URL saved successfully in your API.');
            } else {
              console.error('Failed to save S3 URL.');
            }
          })
          .catch((error) => {
            console.error('Error saving S3 URL:', error);
          });
      }
    });
  };
  

  return (
    <div>
      <h2>Image Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {imageData && <img src={imageData} alt="Uploaded Image" width="500" height="auto"/>}
    </div>
  );
};

export default ImageUploadForm;
