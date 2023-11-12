import React, { useState, useEffect } from 'react';
import UserImageUploadForm from '../../components/userImageForm';
import { useUserData } from '../../context/userContext';


export default function UserProfile() {
    const { userId } = useUserData();
    const userId2 = userId;
    console.log('userId' + userId);

    console.log('userId' + userId);
    const [newArtist, setNewArtist] = useState([]);

    const { artistIdNew, profileData, setProfileData } = useUserData();
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const savedArtistsResponse = await fetch(`/api/user/${userId2}/savedArtists`);
                if (savedArtistsResponse.ok) {
                    const artistData = await savedArtistsResponse.json();
                    setNewArtist(artistData);
                    console.log(artistData)
                } else {
                    console.log('Failed to fetch saved artists');
                }
            } catch (e) {
                console.log('Issue getting artist data');
            }
        }

        fetchData();
    }, [userId]);



    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/artist/${artistIdNew}`);
                if (response.ok) {
                    const data = await response.json();
                    setImageData(data)
                    set
                } else {
                    console.error('Failed to fetch image data');
                }
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        fetchProfile();
    }, [artistIdNew]);

    return (
        <div style={{ backgroundImage: `url('/oranges.jpg')`, width: 'auto' }}>
            <UserImageUploadForm />
            {imageData && (
                <img src={imageData.imageUrl} alt="Artist Image" />
            )}

            <h1>User Profile</h1>
            <div>User ID: {userId}</div>
            <div class="card">
                <h2>Saved Artists</h2>
                <ul>
                    {Array.isArray(newArtist.data) ? (
                        newArtist.data.map((artist) => (
                            <li key={artist._id}>
                                <div> {artist.username} </div>
                            </li>
                        ))
                    ) : (
                        <li>
                            <div>No saved artists available.</div>
                        </li>
                    )}
                </ul>
            </div>
            <div class="card">
            </div>
        </div>

    );
}
