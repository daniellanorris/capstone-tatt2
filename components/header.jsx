
import { useUserData } from '../context/userContext';
import Logout from './handleLogout'
import React, {Image} from 'react'

export default function Header() {
    const { userId } = useUserData()
    const { isArtist } = useUserData();
    const { isUser } = useUserData();
    const {isLoggedIn} = useUserData()
    console.log(userId)

    return (
        <>
            <header expand="lg" data-bs-theme="dark" bg="dark">
                <nav>
                    <div class="logo">
                        <a href="/">
                            <Image src="public/logo.png" width="100px" height="auto"/>
                        </a>
                    </div>
                    {isLoggedIn === true ? (
                    <div>
                    <ul class="nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Contact</a></li>
                        {isUser === true ? (<li><a href={`/user/${userId}`}>User Profile</a></li>) : (
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
}
                </nav>
            </header>
        </>
    );
}
