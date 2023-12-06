import React from 'react';
import AWS from 'aws-sdk';
import { useUserData } from '../context/userContext';


const UserImageUploadForm = () => {
  const { selectedFile, setSelectedFile, profileData, setProfileData, userId} = useUserData();
console.log(userId)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = () => {
    if (!selectedFile) {
      console.error('No file selected for upload.');
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
      Body: selectedFile,
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        alert('Image upload to S3 failed.');
      } else {
        alert('Image uploaded successfully.');
  
  
     
        const s3Url = data.Location;
  
        const profileUrl = URL.createObjectURL(selectedFile);
        setProfileData(profileUrl);
  
        const profileUrls = [s3Url];
        sendImageUrlsToAPI(profileUrls);
      }
    });
  };
  
  const sendImageUrlsToAPI = (profileUrls) => {
    console.log(userId)
   
    fetch(`/api/user/${userId}/images`, {
      method: 'POST',
      body: JSON.stringify({userId, profileUrls}), 
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
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <input type="file" onChange={handleFileChange} className="form-control mb-3" />
          <button onClick={handleUpload} className="btn btn-primary">Upload Image</button>
          {profileData !== null || undefined && (
            <img src={profileData} alt="Uploaded Image" className="img-fluid mt-3" style={{width:"100px", height:"auto"}} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserImageUploadForm;
