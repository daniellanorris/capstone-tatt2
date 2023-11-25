import React, { useEffect, useState } from 'react';

export default function GeoLocationData() {
  const [geolocationData, setGeolocationData] = useState(null);
  const [geolocationReverse, setGeolocationDataReverse] = useState(null)
  const [error, setError] = useState(null);
  const apiKey = 'prj_live_pk_aceff18739558b092e59a9c9f68ac28f06394682';

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
            console.log('IP Geocode Result:', result);
            setGeolocationData(result);

            const lat = result.address.latitude;
            const long = result.address.longitude;
            const location = { lat, long }; 
            console.log('location', location)


            Radar.reverseGeocode(location, (err, resultReverse) => {
              if (err) {
                console.error('Reverse Geocode Error:', err);
                setError('There was an issue with reverse geocoding.');
              
                return;
              }
            
              console.log('Reverse Geocode Result:', resultReverse);
            
              setGeolocationDataReverse(resultReverse);
        
            });



          }
        });
      } catch (error) {
        console.error('Error fetching geolocation data:', error);
        setError('There was an issue getting the geolocation data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { geolocationData, error, geolocationReverse};
}
