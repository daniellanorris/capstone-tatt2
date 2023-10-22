import { useRouter } from 'next/router';
import React, { useState } from 'react';
import cookie from 'js-cookie';

export default function SignupArtists() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [message, setMessage] = useState('');

    async function handleValidation() {
        if (username && password && firstname && lastname) {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    firstname,
                    lastname,
                }),
            });

            if (response.status === 201) {
                const data = await response.json();
                const userId = data.data._id
                cookie.set("token", JSON.stringify({ username, userId }), { expires: 1 / 24 });

                setMessage('Signup successful');
                router.push('/');
            } else if (response.status === 400) {
                const data = await response.json();
                setMessage(data.message);
            } else {
                setMessage('Signup failed');
            }
        } else {
            setMessage('Please fill out all fields');
        }
    }

    return (
        <div className="bg-white card">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
            />
            <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter first name"
            />
            <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Enter last name"
            />
            <button type="button" onClick={handleValidation}>
                Submit
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
