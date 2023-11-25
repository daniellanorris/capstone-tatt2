import React, { useEffect, useState } from 'react';
import { useUserData } from '../../context/userContext';
import { useRouter, Link } from 'next/router';



export default function ArtistPage() {
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIsLoggedIn, setIsArtist } = useUserData();


  const router = useRouter();
const { artistId } = router.query;

  useEffect(() => {
    setIsLoggedIn(true);
    setIsArtist(true);
  }, [setIsLoggedIn, setIsArtist]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (artistId != null) {
          const response = await fetch(`/api/artist/${artistId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
          }

          const artistData = await response.json();
          setArtistData(artistData);
          console.log('Artist Data:', artistData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    console.log('Current artistId:', artistId);
    fetchData();
  }, [artistId]);

  return (
    <div style={{ width: 'auto', height: '100vw' }}>
      <h1>Profile</h1>
      <a href={`/artist/${artistId}/profile`}>
    <button > Edit profile </button> 
    </a>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p> Error: {error} </p> 
      ) : (
        <div className="row">
          <div className="col-md-4 mb-4">
            <div class="card">
              <h2 className="card-title">Artist Details</h2>
              <p className="card-text">Id: {artistData?.data._id}</p>
              <p className="card-text">Username: {artistData?.data.username}</p>
              <p className="card-text">First Name: {artistData?.data.firstname}</p>
              <p className="card-text">Last Name: {artistData?.data.lastname}</p>
            </div>
          </div>
          <div className="col-md-8 mb-4">
  <div className="card">
    <h3 className="card-title">Images:</h3>
    <div className="row">
      {artistData && artistData.data && artistData.data.image && artistData.data.image.map((imageUrl, index) => (
        <div key={index} className="col-md-3 mb-2">
          <div className="card image-container">
            <img src={imageUrl} alt={`Image ${index}`} className="card-img-top img-fluid" style={{ width: "200px", height: "auto" }} />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

          <div className="col-md-4 mb-4">
          <div class="card">
  <h3>Profile Picture:</h3>
  {artistData && artistData.data && artistData.data.profilePicture && (
    <img src={artistData.data.profilePicture} width="100px" height="auto" alt="Profile" />
  )}
</div>
          </div>
        </div>
      )}
    </div>
  );
}