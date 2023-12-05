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
  const [selectedStyles, setSelectedStyles] = useState(tattooStyles);
  console.log(selectedStyles)
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
    if (!selectedStyles.includes(style)) {
      const updatedSelectedStyles = [...selectedStyles, style];
      setSelectedStyles(updatedSelectedStyles);
      setTattooStyles(updatedSelectedStyles);
      saveTattoosToArtist(artistIdNew, style);
    } else {
      const updatedSelectedStyles = selectedStyles.filter((s) => s !== style);
      setSelectedStyles(updatedSelectedStyles);
      setTattooStyles(updatedSelectedStyles);
      deleteTattoosFromArtist(artistIdNew, style);
    }
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



  function goBack() {
    router.back()
  }

  return (
    <div style={{ paddingBottom: "300px" }} className="container row">
      <button className="col-1" onClick={goBack}> Go Back </button>
      {artistIdNew == artistId ? (
        <div>
          <div className="container row d-flex">
            <div class="card col m-1" style={{ padding: "0px" }}>
              <h2 className="custom-card-header">Image Upload</h2>
              <div style={{ padding: "0px" }}>
                <ImageUploadForm />
                {imageData && <img src={imageData} alt="Artist Image" />}
              </div>
            </div>
            <div class="card col m-1" style={{ padding: "0px" }}>
              <h2 className="custom-card-header">Change Your Profile Picture</h2>
              <div style={{ padding: "10px" }}>
                <p>Select an image to update your profile picture!</p>

                <ProfileUploadForm />
              </div>
            </div>
          </div>
          <div className="container row d-flex">
            <div className="col">
              <div className="grid column">
                <div className="card " >
                  <h2 className="custom-card-header">Select your preferred tattoo styles</h2>
                  <div style={{ padding: '10px' }}>
                    <form>
                      {tattooStylesArray.map((style, index) => (
                        <input
                          key={index}
                          onClick={() => toggleSelectedStyle(style)}
                          className={`btn mx-2 ${selectedStyles.includes(style) ? 'selected' : 'button'}`}
                          style={{
                            backgroundColor: selectedStyles.includes(style) ? 'green' : '#F27178',
                            color: 'white',
                            borderRadius: '20px',
                            marginTop: '3px',
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
                    <UploadBio artistId={artistId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      ) : (<h3> This is not your profile to edit, back off! </h3>)}

    </div>
  );
}
