import React, { useState, useEffect } from 'react';
import ImageUploadForm from '../../../components/imageForm';
import { useUserData } from '../../../context/userContext';
import ProfileUploadForm from '../../../components/profileForms'

export default function ImageForm() {
  const { artistIdNew, profileData, setProfileData } = useUserData();
  const [imageData, setImageData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/artist/${artistIdNew}/images`);
        if (response.ok) {
          const data = await response.json();
          // Assuming the API response contains image data
          setImageData(data);
        } else {
          console.error('Failed to fetch image data');
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      }
    };

    fetchData();
  }, [artistIdNew]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/artist/${artistIdNew}/profile`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data)
          set
        } else {
          console.error('Failed to fetch image data');
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      }
    };

    fetchProfile();
  }, [artistIdNew]);

  return (
    <div style={{ backgroundImage: `url('/oranges.jpg')`, width: 'auto' }}>
      <ImageUploadForm />
      {imageData && (
        <img src={imageData.imageUrl} alt="Artist Image" />
      )}
      <ProfileUploadForm />
      {profileData && (
        <img src={profileData.profileUrls} alt="Profile Picture" />
      )}
    </div>
  );
}
