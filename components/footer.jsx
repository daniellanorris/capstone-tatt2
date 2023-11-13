import {Image} from 'react-bootstrap'

export default function Footer() {

    return (
        <>
        <footer class="footer">
            <nav>
                <div class="logo">
                    <a href="/">
                    <Image src="/logo.png" width={100} height={100} />
                    </a>
                </div>
                <div>
                    <a href="/">Home</a>
                   <a href="/about">Tattoo Aftercare</a>
                   <a href="/services">My profile</a>
                </div>
            </nav>
        </footer>
        
        </>
    )





} 