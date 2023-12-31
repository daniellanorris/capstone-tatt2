import React, { useEffect, useState } from 'react';

export default function GeoLocationData() {
  const [geolocationData, setGeolocationData] = useState(null);
  const [geolocationReverse, setGeolocationDataReverse] = useState(null);
  const [error, setError] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY
  useEffect(() => {
    const fetchData = async () => {
      try {
        Radar.initialize(apiKey);

        Radar.ipGeocode((err, result) => {
          if (err) {
            console.error('Error during IP geocoding:', err);
            setError('There was an issue getting the geolocation data.');
            return;
          }

          if (result) {
            setGeolocationData(result);

            const lat = result.address.latitude;
            const long = result.address.longitude;

            console.log(lat, long)
            const location = { lat, long };



            Radar.reverseGeocode(location, (err, resultReverse) => {
              if (err) {
                console.error('Reverse Geocode Error:', err);
                setError('There was an issue with reverse geocoding.');
                return;
              }

              setGeolocationDataReverse(resultReverse);
              console.log(resultReverse);  // Log the correct variable
            });
          }
        });
      } catch (error) {
        console.error('Error fetching geolocation data:', error);
        setError('There was an issue getting the geolocation data.');
      }
    };

    fetchData();
  }, []);

  return { geolocationData, error, geolocationReverse };
}
