import React, { useState, useEffect } from 'react';
import { useUserData } from '../../context/userContext';

export default function UserProfile() {
    const { userId } = useUserData();
    const userId2 = userId;
    console.log('userId' + userId);
    const [newArtist, setNewArtist] = useState([]);

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

    return (
        <>
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
        </>
    );
}
