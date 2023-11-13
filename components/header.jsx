
import { useUserData } from '../context/userContext';
import Logout from './handleLogout'
import React from 'react'
import Image from 'next/image'

export default function Header() {
    const { userId, isArtist, isUser, isLoggedIn, artistIdNew, profileData, artistProfileData } = useUserData()
    console.log('profileData' + profileData)


    console.log(userId)

    return (
        <>
            <header expand="lg" class="p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', color: 'black', marginBottom: '10px'}}>
                <div class="container" >
                    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <div>
                            <div class="logo">
                                <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                    <Image src="/logo.png" width={100} height={100} />
                                </a>
                            </div>

                        </div>
                        {isLoggedIn === true ? (
                            <div>
                                <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                                    <li><a class="nav-link px-2 text-black" href="/"><h3>Home</h3></a></li>
                                    <li><a class="nav-link px-2 text-black" href="/about"><h3>About</h3></a></li>
                                    <li><a class="nav-link px-2 text-black" href="/contact"><h3>Contact</h3></a></li>
                                    {isUser === true ? (<li><a class="nav-link px-2 text-black" href={`/user/${userId}`}><h3>User Profile</h3></a></li>) : (
                                        null)
                                    }
                                    {isArtist === true ? (
                                        <li><a class="nav-link px-2 text-black" href={`/artist/${artistIdNew}`}><h3>Artist Profile</h3></a></li>
                                    ) : (
                                        null
                                    )
                                    }
                                    <li>  <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                                        <div style={{ borderRadius: "60px", border: "8px solid orange", overflow: "hidden" }}>
                                            <img src={profileData || artistProfileData} width={100} height={100} />
                                        </div>
                                    </a></li>
                                </ul>
                                <div>

                                </div>
                            </div>
                        ) : (
                            null
                        )
                        }
                        {isLoggedIn === true ? (
                            <Logout />
                        ) : (
                            null

                        )
                        }                   </div>
                </div>
            </header>
        </>
    );
}
