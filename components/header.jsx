
import React from 'react';
import { useUserData } from '../context/userContext';

export default function Header() {

    return (
        <>
            <header expand="lg" data-bs-theme="dark" bg="dark">
                <nav>
                    <div class="logo">
                        <a href="/">Your Logo</a>
                    </div>
                    <ul class="nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact</a></li>
                        {/* <li><a href={`/user/${userId}`}>Saved Artists</a></li> */}
                    </ul>
                </nav>
            </header>
        </>
    );
}
