import React, { useState, useEffect } from 'react';
import ImageUploadForm from '../../../components/imageForm';
import { useUserData } from '../../../context/userContext';
import ProfileUploadForm from '../../../components/profileForms';
import { useRouter } from 'next/router'


export default function ImageForm() {
  const router = useRouter()
  const { artistId } = router.query;
  const [imageData, setImageData] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const { tattooStyles, setTattooStyles, artistIdNew, setArtistProfileData } = useUserData();
  const tattooStylesArray = [
    'American Traditional',
    'Japanese Traditional',
    'Fine-line',
    'Realistic',
    'Surrealist',
    'Blackwork',
    'Neo Traditional',
    'Watercolor',
    'Abstract',
    'New School',
    'Tribal',
    'Stick and Poke'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/artist/${artistIdNew}/images`);
        if (response.ok) {
          const data = await response.json();
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
          setArtistProfileData(data);
        } else {
          console.error('Failed to fetch image data');
        }
      } catch (error) {
        console.error('Error fetching image data:', error);
      }
    };

    fetchProfile();
  }, [artistIdNew]);

  function toggleSelectedStyle(index) {
    const updatedSelectedStyles = [...selectedStyles];
    updatedSelectedStyles[index] = !updatedSelectedStyles[index];
    setSelectedStyles(updatedSelectedStyles);
    setTattooStyles(...tattooStyles, selectedStyles)
    console.log(tattooStyles)
  }
  return (
    <>
    {artistIdNew == artistId ? (
    <div style={{ backgroundImage: `url('/oranges.jpg')`, width: 'auto' }}>
      <ImageUploadForm />
      {imageData && <img src={imageData} alt="Artist Image" />}
      
      <h2>Change Your Profile Picture</h2>
      <p>Select an image to update your profile picture!</p>
      <ProfileUploadForm />
      <div>
        <h2>Select your preferred tattoo styles</h2>
        <div class="grid column">
          <div class="card col-6" style={{ padding: '10px' }}>
            <form>
              {tattooStylesArray.map((style, index) => (
                <input
                  key={index}
                  onClick={() => toggleSelectedStyle(index)}
                  class={`btn mx-2 ${selectedStyles[index] ? 'selected' : 'button'}`}
                  style={{
                    backgroundColor: selectedStyles[index] ? 'pink' : 'green',
                    color: 'white',
                    borderRadius: '20px',
                    marginTop: '3px'
                  }}
                  type="button"
                  value={style}
                />
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  
    ) :( <div> This is not your profile to edit </div>)}

      </>
  );
}
