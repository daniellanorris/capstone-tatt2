import React, { useState, useEffect } from 'react';
import ImageUploadForm from '../../../components/imageForm';
import { useUserData } from '../../../context/userContext';
import ProfileUploadForm from '../../../components/profileForms';
import { useRouter } from 'next/router'
import UploadAddress from '../../../components/addressUpload'
import UploadBio from '../../../components/bioUpload'
import saveTattoosToArtist from '../../../config/db/controllers/tattooStylesAddController'
import deleteTattoosFromArtist from '../../../config/db/controllers/deleteTattooStyle'


export default function ImageForm() {
  const router = useRouter()
  const { artistId } = router.query;
  const [imageData, setImageData] = useState('');

  const { tattooStyles, setTattooStyles, artistIdNew, setArtistProfileData } = useUserData();

  console.log(tattooStyles)
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

  function toggleSelectedStyle(style) {
    const updatedTattooStyles = [...tattooStyles];

    if (!updatedTattooStyles.includes(style)) {
      saveTattoosToArtist(artistIdNew, style)
      updatedTattooStyles.push(style);
    } else {
      const index = updatedTattooStyles.indexOf(style);
      if (index !== -1) {
        updatedTattooStyles.splice(index, 1);
        deleteTattoosFromArtist(artistIdNew, style)
      }
    }
    setTattooStyles(updatedTattooStyles);
  }

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
  }, [artistIdNew, tattooStyles]);



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



  function goBack() {
    router.back()
  }

  return (
    <div style={{ paddingBottom: "300px" }} className="container row">
      <button style={{ width: "75px" }} onClick={goBack}> Back </button>
      {artistIdNew == artistId ? (
        <>
          <div className="container">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card" style={{ padding: "0px" }}>
                  <h2 className="custom-card-header">Image Upload</h2>
                  <div style={{ padding: "10px" }}>
                    <p>Select an image to update your profile picture!</p>
                    <ImageUploadForm />
                    {imageData && <img src={imageData} alt="Artist Image" />}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card" style={{ padding: "0px" }}>
                  <h2 className="custom-card-header">Change Your Profile Picture</h2>
                  <div style={{ padding: "10px" }}>
                    <p>Select an image to update your profile picture!</p>
                    <ProfileUploadForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container row d-flex">
            <div className="col">
              <div className="grid column">
                <div className="card ">
                  <h2 className="custom-card-header">Select your preferred tattoo styles</h2>
                  <div style={{ padding: '10px' }}>
                    {tattooStylesArray.map((style, index) => (
                      <input
                        key={index}
                        className={`btn mx-2 ${tattooStyles.includes(style) ? 'selected' : 'button'}`}
                        style={{
                          backgroundColor: tattooStyles.includes(style) ? 'green' : '#F27178',
                          color: 'white',
                          borderRadius: '20px',
                          marginTop: '3px'
                        }}
                        onClick={() => toggleSelectedStyle(style)}
                        type="button"
                        value={style}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="col">
                <div className='card'>
                  <h2 className="custom-card-header"> Address?</h2>
                  <div style={{ padding: '10px' }}>
                    <UploadAddress artistId={artistId} />
                  </div>
                </div>
              </div>
              <div className="col mt-1">
                <div className="card">
                  <h2 className="custom-card-header"> Edit Bio</h2>
                  <div style={{ padding: '10px' }}>
                    <UploadBio artistId={artistId} style={{maxWidth: "100%"}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h3> This is not your profile to edit, back off! </h3>
      )}
    </div>
  );
      }  