import React, { useState, useEffect } from 'react';
import ImageUploadForm from '../../../components/imageForm';
import { useUserData } from '../../../context/userContext';

export default function ImageForm() {
  const { artistIdNew } = useUserData();
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

  return (
    <div>
      <ImageUploadForm />
      {imageData && (
        <img src={imageData.imageUrl} alt="Artist Image" />
      )}
    </div>
  );
}
