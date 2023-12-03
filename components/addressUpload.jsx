import { useState } from 'react';

const UploadAddress = ({ artistId }) => {
    console.log('artistId' + artistId)
  const [input, setInput] = useState('');
  const address = JSON.stringify(input)
  console.log(address)

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
   

      const data = await response.json();
      console.log(data); 

      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to upload address. Status: ${response.status}`);
      }


    } catch (error) {
      console.error('Error uploading address:', error.message);

    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadAddress();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
      />
      <button type="submit">Enter</button>
    </form>
  );
};

export default UploadAddress;
