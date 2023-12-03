
export default async function deleteImage(imageUrl, artistId) {
    console.log(imageUrl, artistId)

    try {
        const response = await fetch(`/api/artist/${artistId}/images`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ artistId, imageUrl}),
      });

      
        if (response.ok) {
            console.log('response ok')

        } else if (response.status === 400) {
          const data = await response.json();
          console.error('Request failed:', data.message);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };


