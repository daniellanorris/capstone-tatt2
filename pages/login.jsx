import React, { useState } from 'react';
import LoginArtists from '../components/artistLogin';
import LoginUsers from '../components/userLogin';


export default function Login() {
    const [user, setUser] = useState(false);
    const [artist, setArtist] = useState(true);


    return (
        <div className="text-center">
          <div className="d-flex flex-column align-items-center" style={{ minHeight: '100vh' }}>
      
            <div >
              <button onClick={() => { setUser(true); setArtist(false); }}>User Login</button>
              <button onClick={() => { setUser(false); setArtist(true); }}>Artist Login</button>
            </div>
            <div className="card text-center" style={{ width: "75%" }}>
              <div className="card-body">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      {user ? <LoginUsers /> : artist ? <LoginArtists /> : null}
                    </div>
                    <a href="/signup" className="mt-3"> Need to sign up? Click here </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      
}