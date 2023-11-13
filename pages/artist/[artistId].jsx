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
    <div style={{ backgroundImage: `url('/tatt_bg.jpg')`, width: 'auto' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <h2>Artist Details</h2>
          <p>Id: {artistData?.data._id}</p>
          <p>Username: {artistData?.data.username}</p>
          <p>First Name: {artistData?.data.firstname}</p>
          <p>Last Name: {artistData?.data.lastname}</p>
          <h3>Images:</h3>
          <div className="row">
            {Array.isArray(artistData.data.image) &&
              artistData.data.image.map((imageUrl, index) => (
                <div key={index} className="col-md-3">
                  <div className="container" width="100px" height="100px">
                    <img src={imageUrl} alt={`Image ${index}`} className="img-fluid" />
                  </div>
                </div>
              ))}
          </div>
          <h3>Profile Picture:</h3>
          <img src={artistData.data.profilePicture} width="100px" height="auto" alt="Profile" />
        </div>
      )}
    </div>
  );
}
