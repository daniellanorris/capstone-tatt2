import React, { useState, useEffect } from 'react';

const UploadAddress = ({ artistId }) => {
  const [input, setInput] = useState('');
  const [addressData, setAddressData] = useState('');

  const uploadAddress = async () => {
    try {
      const response = await fetch(`/api/artist/${artistId}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: input,
          artistId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to upload address. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error uploading address:', error.message);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const getAddress = async () => {
    try {
      const response = await fetch(`/api/artist/${artistId}/address`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const addressInsert = data.data.address;
        setAddressData(addressInsert);
      } else {
        console.error('Failed to fetch artist address');
      }
    } catch (error) {
      console.error('Error fetching artist address:', error);
    }
  };

  useEffect(() => {
    getAddress();
  }, [artistId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadAddress();
    getAddress();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">Enter</button>
      </form>
      <div style={{paddingTop: "10px"}}>
        <h3>Current address: </h3> <p> {addressData}</p>
      </div>
    </>
  );
};

export default UploadAddress;
