import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {useUserData} from '../../context/userContext'

export default function ArtistPage(req) {
  const router = useRouter();
  const  {artistIdNew}  = useUserData()
  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    fetch(`/api/artist/${artistIdNew}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setArtistData(data.data); // Access data within the response
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [artistIdNew]);
  
  return (
    <>
   <div style={{ backgroundImage: `url('/tatt_bg.jpg')`, width: 'auto' }}>
    {artistData && (
      <div class="card">
        <h2>Artist Details</h2>
        <p> Id: {artistData._id}</p>
        <p>Username: {artistData.username}</p>
        <p>First Name: {artistData.firstname}</p>
        <p>Last Name: {artistData.lastname}</p>
        <h3>Images:</h3>
          <div className="row">
            {artistData.image.map((imageUrl, index) => (
              <div key={index} className="col-md-3">
                <div class="container" width="100px" height="100px">
                <img src={imageUrl} alt={`Image ${index}`} className="img-fluid"/>
                </div>
              </div>
            ))}
          </div>
          <h3> Profile Picture: </h3>
              <img src={artistData.profilePicture} width="100px" height="auto"/> 
      </div>
    )}
    </div>
    </>
  );
}
