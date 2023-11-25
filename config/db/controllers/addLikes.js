
export default function useAddLikes() {
    const addLikes = async (artistId, userId) => {
      console.log('artist and user id', artistId, userId);
  
      try {
        const response = await fetch(`/api/artist/${artistId}/likes`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, artistId }),
      });
      
      console.log('Response Status:', response.status);
      console.log('Response Text:', await response.text());

        if (response.ok) {
          console.log('Posted to the artist endpoint');
        } else if (response.status === 400) {
          const data = await response.json();
          console.error('Request failed:', data.message);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };
  
    return { addLikes };
  }
  