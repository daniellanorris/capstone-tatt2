import {Image} from 'react-bootstrap'
import {useUserData} from '../context/userContext'


export default function Footer() {
   const {isUser, artistIdNew, userId, isLoggedIn} = useUserData()

    return (
        <>
        {isLoggedIn ? (
        <footer className="footer">
            <nav>
                <div className="logo">
                    <a href="/home">
                    <Image src="/logo.png" width={100} />
                    </a>
                </div>
                <div>
                    <a href="/home"><h3>Home </h3></a>
                    {isUser? (
                    <a href={`/user/${userId}`}>
                        <h3>My profile </h3></a>) 
                    :(<a href={`/artist/${artistIdNew}`}><h3> My profile </h3></a>)}

                </div>
            </nav>
        </footer>
        ) : (null)
}
        </>
    )



} 