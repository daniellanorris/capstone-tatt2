
import { useUserData } from '../context/userContext';
import Logout from './handleLogout'
import React from 'react'
import Image from 'next/image'

export default function Header() {
    const { userId } = useUserData()
    const { isArtist } = useUserData();
    const { isUser } = useUserData();
    const {isLoggedIn} = useUserData()
    console.log(userId)

    return (
        <>
            <header expand="lg" class="p-3 bg-dark text-white">
                <div class="container">
                    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <div class="logo">
                        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                            <Image src="/logo.png" width={100} height={100}/>
                        </a>
                    </div>
                    {isLoggedIn === true ? (
                    <div>
                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><a class="nav-link px-2 text-secondary" href="/">Home</a></li>
                        <li><a class="nav-link px-2 text-secondary" href="/about">About</a></li>
                        <li><a class="nav-link px-2 text-secondary" href="/services">Services</a></li>
                        <li><a class="nav-link px-2 text-secondary" href="/contact">Contact</a></li>
                        {isUser === true ? (<li><a class="nav-link px-2 text-secondary" href={`/user/${userId}`}>User Profile</a></li>) : (
                            null )
                        }
                    </ul>
                    </div>
                    ) : (
                        null
                    )
                    }
                    {isLoggedIn === true ? (
                    <Logout/>
                    ) : (
                       null

                    )
}                   </div>
                </div>
            </header>
        </>
    );
}
