import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ArtistPage() {
  const router = useRouter();
  const { query } = router;
  const { artistId } = query;
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Current artistId:', artistId);

    const fetchData = async () => {
      try {
        if (artistId !== undefined && artistId !== null) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId]);

  return (
    <div style={{ width: 'auto', height: '100vw' }}>
      <h1>Profile</h1>
      {loading ? (
        <p>Loading...</p>
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