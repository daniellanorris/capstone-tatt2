// components/geolocationReverse.jsx
import React, { useEffect, useState } from 'react';

export default async function ArtistGeolocationReverse( location ) {
  const [geolocationData, setGeolocationData] = useState({ geolocationReverse2: ''});
  const [error, setError] = useState(null);
  const apiKey = 'prj_live_pk_aceff18739558b092e59a9c9f68ac28f06394682';

  useEffect(() => {
    const fetchData = async () => {
    try {
      await Radar.initialize(apiKey);
    

      const latitude = location.latitude
      const longitude = location.longitude

        const locationObj = {latitude, longitude}

      await Radar.reverseGeocode(locationObj, (err, resultReverseNew) => {
        if (err) {
            console.error('Reverse Geocode Error:', err);
            setError('There was an issue with reverse geocoding.');
            return;
          }
      

        setGeolocationData({ geolocationReverse2: resultReverseNew});
        console.log({ geolocationReverse2: resultReverseNew})
    

        console.log(resultReverseNew);
      });
    } catch (error) {
      console.error('Error fetching geolocation data:', error);
      setGeolocationData({ geolocationReverse2: '', error: 'There was an issue getting the geolocation data.' });
    }
}
fetchData()
  }, []);

 return { geolocationData, error };
}
