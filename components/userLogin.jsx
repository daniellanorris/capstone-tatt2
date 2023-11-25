import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import cookie from 'js-cookie';
import { useUserData } from '../context/userContext';
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import fetchUsers from '../config/db/controllers/fetchUsers'


export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        const props = {};
        if (user) {
            props.user = req.session.user;

        }

        return { props };
    },
    sessionOptions
);


export default function Login(props) {
    


    const router = useRouter();
    console.log(props.user)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setIsArtist, setIsUser, setIsLoggedIn, setUserId} = useUserData();

    useEffect(() => {
        setIsUser(true);
        setIsArtist(false);
    }, []);

    async function handleLogin(event) {
        event.preventDefault();

        if (username && password) {
            setIsLoading(true);

            try {
                const action = 'loginUser';
                const response = await fetch(`/api/auth/${action}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {

                    const userData = await fetchUsers();

                    console.log('user data', userData);

                    const userArray = userData.data; // Access the 'data' property

                    const user = userArray.find(user => user.username === username); 
                    
                    console.log(user)// Use 'find' on the array
                    const userId = user ? user._id : null;

                    console.log('userId' + userId)

                    setUserId(userId)


                    const responseBody = await response.text();
                    const res = responseBody ? JSON.parse(responseBody) : {};
                    console.log('responseBody:', responseBody);

                    cookie.set("token", JSON.stringify({ username, isUser: true, isArtist: false, isLoggedIn: true, userId }), { expires: 365 });

                    setMessage('Login successful');
                    setIsLoggedIn(true);
                    router.push('/');
                } else if (response.status === 400) {
                    const data = await response.json();
                    setMessage(data.message || 'Invalid credentials');
                } else {
                    setMessage('Login failed');
                }
            } catch (error) {
                console.error('Login failed:', error);
                setMessage('Login failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <>
            <div className="bg-black card">
                <h2 style={{color: "white"}}> User Login </h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        autoComplete="username"
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </>
    );
}