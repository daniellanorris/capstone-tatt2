import React, { useState, useEffect } from 'react';
import UserImageUploadForm from '../../components/userImageForm';
import { useUserData } from '../../context/userContext';


export default function UserProfile() {
    const { userId } = useUserData();
    const userId2 = userId;

    const [newArtist, setNewArtist] = useState([]);

    const { artistIdNew, profileData, setProfileData } = useUserData();
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const savedArtistsResponse = await fetch(`/api/user/${userId2}/savedArtists`);
                if (savedArtistsResponse.ok) {
                    const artistData = await savedArtistsResponse.json();
                    setNewArtist(artistData);
             
                } else {

                }
            } catch (e) {

            }
        }

        fetchData();
    }, [userId]);



    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/artist/${artistIdNew}`);
                if (response.ok) {
                    const data = await response.json();
                    setImageData(data)
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
        <div className="container" style={{paddingBottom: "100px"}}>
          <h1 className="text-left mt-4">User Profile</h1>

          <div className="row mt-4">
            
            <div className="col-md-6">
              <div className="card">
              <h2> Upload Profile Picture</h2>
                <UserImageUploadForm />
              </div>
            </div>
    
            <div className="col-md-6">
              {imageData && (
                <div className="card">
                  <img src={imageData.imageUrl} alt="Artist Image" className="img-fluid" />
                </div>
              )}
            </div>
          </div>
    
          <div className="card mt-4 p-4">
            <h2 className="card-title">Saved Artists</h2>
            <ul className="list-group list-group-flush">
              {Array.isArray(newArtist.data) && newArtist.data.length > 0 ? (
                newArtist.data.map((artist) => (
                  <li key={artist._id} className="list-group-item">
                    @{artist.username}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No saved artists available.</li>
              )}
            </ul>
          </div>
        </div>
      );
    };