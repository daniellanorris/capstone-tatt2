import { useState } from 'react';

const UploadBio = ({ artistId }) => {
    console.log('artistId' + artistId)
  const [input, setInput] = useState('');
  const bio = JSON.stringify(input)
  console.log(bio)

  const uploadBio = async () => {
    try {
      const response = await fetch(`/api/artist/${artistId}/bio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bio: input, 
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
    uploadBio();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={input}
        onChange={handleInputChange}
        rows={10}
        cols={50}
      />
      <button type="submit">Enter</button>
    </form>
  );
};

export default UploadBio;
