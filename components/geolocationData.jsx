import React, { useEffect, useState } from 'react';

export default function GeoLocationData() {
  const [geolocationData, setGeolocationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Radar.initialize(process.env.GEO_API_KEY);

    Radar.ipGeocode((err, result) => {
      if (err) {
        console.error('Error:', err);
        setError('There was an issue getting the geolocation data.');
        return;
      }

      if (result && result) {
        console.log(result);
        setGeolocationData(result);
      }
    });
  }, []);

  return { geolocationData, error };
}
