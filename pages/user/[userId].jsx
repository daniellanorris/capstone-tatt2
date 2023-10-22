import React, { useState, useEffect } from 'react';
import { useUserData } from '../../context/userContext';

export default function UserProfile() {
    const { userId } = useUserData();
    const userId2 = userId;
    console.log(userId);
    const [newArtist, setNewArtist] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const savedArtistsResponse = await fetch(`/api/user/${userId2}/savedArtists`);
                if (savedArtistsResponse.ok) {
                    const artistData = await savedArtistsResponse.json();
                    setNewArtist(artistData);
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
            <div>User Profile</div>
            <div>User ID: {userId}</div>
            <div>
                <h2>Saved Artists</h2>
                <ul>
                    {Array.isArray(newArtist) ? (
                        newArtist.map((artistId, index) => (
                            <li key={index}>
                                <div> {artistId} </div>
                            </li>
                        ))
                    ) : (
                        <li>
                            <div>No saved artists available.</div>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}
