
import { useUserData } from '../context/userContext';

export default function Header() {
    const { userId } = useUserData()
    const { isArtist } = useUserData();
    const { isUser } = useUserData();
    console.log(userId)

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
                        {isUser === true ? (<li><a href={`/user/${userId}`}>User Profile</a></li>) : (
                            null)
                        }
                    </ul>
                </nav>
            </header>
        </>
    );
}
