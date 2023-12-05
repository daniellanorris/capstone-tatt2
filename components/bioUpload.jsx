import { useEffect, useState } from 'react';

const UploadBio = ({ artistId }) => {
    console.log('artistId' + artistId)
  const [bioData, setArtistBio] = useState('')
  const [input, setInput] = useState(bioData);
  const bio = JSON.stringify(input)
  const [message, setMessage] = useState('')
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

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`/api/artist/${artistId}/bio`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          const bioDataInsert = data.data.bio

          setArtistBio(bioDataInsert);
          setInput(bioDataInsert)
        } else {
          console.error('Failed to fetch artist bio');
        }
      } catch (error) {
        console.error('Error fetching artist bio:', error);
      }
    };
  
    fetchArtist();
  
  }, []); 

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Bio saved');

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  useEffect(() => {
    let timeoutId;

    if (message) {
      timeoutId = setTimeout(() => {
        setMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);


  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={input}
        onChange={handleInputChange}
        rows={10}
        cols={50}
      />
      <button type="submit">Enter</button>
      {message}
    </form>
  );
};

export default UploadBio;
