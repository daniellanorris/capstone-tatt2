import React, { useState } from 'react';
import SignupArtists from '../components/artistSignup';
import SignupUsers from '../components/userSignup';


export default function Signup() {
    const [user, setUser] = useState(false);
    const [artist, setArtist] = useState(true); // Default to artist signup

    const updateArtistData = (artistData) => {
        // Update the artist state with the newly signed-up artist data
        setArtist(artistData);
    };

    return (
        <div className="justify-content-center align-content-center" style={{ minHeight: '100vh' }}>
            <div>
                <button onClick={() => { setUser(true); setArtist(false); }}>User Signup</button>
                <button onClick={() => { setUser(false); setArtist(true); }}>Artist Signup</button>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="container">
                        <div className="row">
                            <div>
                                {user ? <SignupUsers /> : artist ? <SignupArtists updateArtistData={updateArtistData} /> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}