// GeoLocationData.jsx
import React, { useEffect, useState } from 'react';

export default function GeoLocationData() {
  const [geolocationData, setGeolocationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const apiKey = 'prj_live_pk_aceff18739558b092e59a9c9f68ac28f06394682';

  useEffect(() => {
    Radar.initialize(apiKey);

    Radar.ipGeocode((err, result) => {
      if (err) {
        console.error('Error:', err);
        setError('There was an issue getting the geolocation data.');
        setLoading(false); 
        return;
      }

      if (result && result) {
        console.log('result' + result);
        setGeolocationData(result);
        setLoading(false); 
      }
    });
  }, []);

  return { geolocationData, error, loading };
}
