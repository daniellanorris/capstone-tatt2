import React, { useState } from 'react';
import SignupArtists from '../components/artistSignup';
import SignupUsers from '../components/userSignup';


export default function Signup() {
    const [user, setUser] = useState(false);
    const [artist, setArtist] = useState(true); // Default to artist signup

    const updateArtistData = (artistData) => {
        setArtist(artistData);
    };

    return (
        <div>
        <div className="d-flex flex-column align-items-center" style={{ minHeight: '100vh' }}>
        <p className="text-center">Welcome to <em>Tatt(2)</em>, the premier app for tattoo lovers and givers.</p>
          <div className="text-center">
            <button onClick={() => { setUser(true); setArtist(false); }}>User Signup</button>
            <button onClick={() => { setUser(false); setArtist(true); }}>Artist Signup</button>
          </div>
          <div className="card" style={{ width: "75%" }}>
            <div className="card-body">
              <div className="container">
                <div className="row">
                  <div className="col-12 text-center">
                    {user ? <SignupUsers role="user" /> : artist ? <SignupArtists role="artist" updateArtistData={updateArtistData} /> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center"> <a href="/login"> Login instead? Click here. </a></p>
        </div>
        </div>
      );
      
      
}