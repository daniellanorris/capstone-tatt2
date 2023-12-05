export default function saveTattoosToArtist(artistIdNew, style) {

  const saveTatts = async () => {
    try {
        if (!artistIdNew) {
            console.error('Artist ID is undefined');
            return;
        }
        console.log(style);

        const response = await fetch(`/api/artist/${artistIdNew}/tattooStyles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ style }),
        });
        

        console.log(response);

        if (response === 201) {
            console.log(response, 'success');
        } else if (response.status === 400) {
            const data = await response.json();
            console.error('Request failed:', data.message);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
};

saveTatts();
  }
  

