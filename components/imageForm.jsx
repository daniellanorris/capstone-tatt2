import React, { useState, useEffect } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useUserData } from '../context/userContext';

const ImageUploadForm = () => {
  const { selectedFile, setSelectedFile, imageData, setImageData, artistIdNew } = useUserData();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const s3 = new S3Client({ region: 'us-east-1' });

    const params = {
      Bucket: 'tatt2-images',
      Key: `uploads/${Date.now()}-${selectedFile.name}`,
      Body: selectedFile,
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3.send(command);

      alert('Image uploaded successfully.');

      const s3Url = data.Location;
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageData(imageUrl);

      const imageUrls = [s3Url];
      sendImageUrlsToAPI(imageUrls);
    } catch (error) {
      console.error('Image upload to S3 failed:', error);
      alert('Image upload to S3 failed.');
    }
  };

  const sendImageUrlsToAPI = (imageUrls) => {
    fetch(`/api/artist/${artistIdNew}/images`, {
      method: 'POST',
      body: JSON.stringify({ imageUrls }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to save S3 URLs.');
        }
      })
      .catch((error) => {
        console.error('Error saving S3 URLs:', error);
      });
  };

  return (
    <div style={{ maxWidth: '200px' }}>
      <input type="file" onChange={handleFileChange} className="form-control mb-3" style={{ maxWidth: '300px' }} />
      <button className="btn btn-primary" onClick={handleUpload}>
        Upload Image
      </button>
      {imageData && <img src={imageData} alt="Uploaded Image" className="img-fluid mt-3" width="200px" height="auto" />}
    </div>
  );
};

export default ImageUploadForm;
