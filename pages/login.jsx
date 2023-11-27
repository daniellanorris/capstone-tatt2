import React, { useState } from 'react';
import LoginArtists from '../components/artistLogin';
import LoginUsers from '../components/userLogin';


export default function Login() {
    const [user, setUser] = useState(false);
    const [artist, setArtist] = useState(true); 


    return (
        <div className="justify-content-center align-content-center" style={{ minHeight: '100vh' }}>
    
            <div>
                <button onClick={() => { setUser(true); setArtist(false); }}>User Login</button>
                <button onClick={() => { setUser(false); setArtist(true); }}>Artist Login</button>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="container">
                        <div className="row">
                            <div>
                                {user ? <LoginUsers /> : artist ? <LoginArtists /> : null}
                            </div>
                           <a href="/signup"> <div> Need to sign up? Click here </div> </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}