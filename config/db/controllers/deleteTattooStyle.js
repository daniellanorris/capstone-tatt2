export default function deleteTattoosFromArtist(artistIdNew, style) {

    const deleteTatts = async () => {
      try {
          if (!artistIdNew) {
              console.error('Artist ID is undefined');
              return;
          }
          console.log(style);
  
          const response = await fetch(`/api/artist/${artistIdNew}/tattooStyles`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ style }),
          });
          
  
          console.log(response);
  
          if (response.ok) {
              console.log(response, 'success, deleted');
          } else if (response.status === 400) {
              const data = await response.json();
              console.error('Request failed:', data.message);
          }
      } catch (error) {
          console.error('Request failed:', error);
      }
  };
  
  deleteTatts();
    }
    
  
  