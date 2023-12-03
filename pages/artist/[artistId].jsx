import React, { useEffect, useState } from 'react';
import { useUserData } from '../../context/userContext';
import { useRouter } from 'next/router';
import deleteImage from '../../config/db/controllers/deleteImage';
import ArtistGeolocationReverse from '../../components/geolocationReverse'

export default function ArtistPage() {
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIsLoggedIn, artistIdNew, isArtist } = useUserData();
  const [geolocationDataTF, setGeolocationDataTF] = useState(false);
  const [latAndLong, setLatLong] = useState('')

  const router = useRouter();

  const { artistId } = router.query;
  
  useEffect(() => {
    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

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

          // const locationString = artistData?.data?.location;
          // console.log(locationString)

          // if (locationString) {
          //   const [lat, lon] = locationString.split(',').map(parseFloat);
          //   setGeolocationDataTF(true)
          //   setLatLong([lat.toString(), lon.toString()]);
          //   console.log(latAndLong);

          //   console.log(geolocationDataTF)

            // return(latAndLong)

          // } else {
          //   console.log('Location string is undefined');
          // }

        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [artistId]);


  // const {geolocationData} = ArtistGeolocationReverse(latAndLong)
  // console.log(geolocationData)

  // const { geolocationReverse2: { addresses: [{ formattedAddress }] } } = geolocationData;

  // console.log(formattedAddress)


  return (
    <div style={{ maxWidth: '100vw', paddingBottom: '200px' }}>
      <div className="container">
      <h1>Profile</h1>
      <div className="row" style={{ width: '100%' }}>
        <div className="col-2 mb-4">
          {artistData && artistData.data && artistData.data.profilePicture && (
            <div
              style={{
                borderRadius: '50%',
                border: '8px solid orange',
                overflow: 'hidden',
                width: 100,
                height: 100,
              }}
              className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
            >
              <img
                src={artistData.data.profilePicture}
                width={100}
                height={100}
                alt="profile"
              />
            </div>
          )}
        </div>
      </div>
   

      {(artistIdNew == artistId) && isArtist ? (
        <a href={`/artist/${artistId}/profile`}>
          <button> Edit profile </button>
        </a>
      ) : null}
         </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="row mx-auto no-gutters" style={{ maxWidth: '100%'}}>
          <div className="col-md-4 mb-4 no-gutters">
            <div className="card " >
              <h2 className="custom-card-header">
                {artistData?.data.firstname} {artistData?.data.lastname}
              </h2>
              <h3>@{artistData?.data.username}</h3>
             <p className="card-text" style={{padding: '5px'}}> {artistData?.data?.address}</p>
            </div>
            <div className="card mt-4">
              <h2 className="custom-card-header">
                bio
              </h2>
             <p style={{padding: '5px'}}> {artistData?.data?.bio}</p> 
          
            
            </div>
          </div>
          <div className="col-md-8 mx-auto no-gutters" style={{ padding: 'none' }}>
            <div className="card">
              <h3 className="custom-card-header">Images</h3>
              <div className="row no-gutters" style={{ width: '100%' }}>
                {artistData &&
                  artistData.data &&
                  artistData.data.image &&
                  artistData.data.image.map((imageUrl, index) => (
                    <div key={index} className="col-sm">
                      <div
                        style={{
                          overflow: 'hidden',
                          borderRadius: '2px',
                        }}

                      >
                        <img
                          src={imageUrl}
                          className='image-fluid'
                          alt={`Image ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      {isArtist && artistId == artistIdNew ? (
                        <button onClick={() => deleteImage(imageUrl, artistId)}>
                          Delete
                        </button>
                      ) : null}
                    </div>
                  ))}
              </div>
            </div>
          </div>
         
        </div>
      )}
    </div>
  );
}

