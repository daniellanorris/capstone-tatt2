
import { useUserData } from '../context/userContext';
import Logout from './handleLogout'
import React from 'react'
import { Image, Navbar, Nav, Container } from 'react-bootstrap';

export default function Header() {
    const { userId, isArtist, isUser, isLoggedIn, artistIdNew, profileData, artistProfileData } = useUserData()
    console.log('profileData' + profileData)


    console.log(userId)

    return (
        <>
          <Navbar expand="lg" className="p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', color: 'black', marginBottom: '10px', width: '100vw' }}>
            <Container>
              <Navbar.Brand href="/" className="d-flex align-items-center text-white text-decoration-none">
                <Image src="/logo.png" width={100} height={100} />
              </Navbar.Brand>
    
              <Navbar.Toggle aria-controls="navbarNav" />
    
              <Navbar.Collapse id="navbarNav" className="justify-content-between">
                {isLoggedIn === true && (
                  <Nav className="me-auto">
                    <Nav.Link href="/"><h3>Home</h3></Nav.Link>
                    <Nav.Link href="/about"><h3>About</h3></Nav.Link>
                    <Nav.Link href="/contact"><h3>Contact</h3></Nav.Link>
                    {isUser === true && <Nav.Link href={`/user/${userId}`}><h3>User Profile</h3></Nav.Link>}
                    {isArtist === true && <Nav.Link href={`/artist/${artistIdNew}`}><h3>Artist Profile</h3></Nav.Link>}
                  </Nav>
                )}

              </Navbar.Collapse>
              <div className="d-flex align-items-center">
                  {isLoggedIn === true && (
                    <>
                      <div style={{ borderRadius: '60px', border: '8px solid orange', overflow: 'hidden' }}>
                        <Image src={profileData || artistProfileData} width={100} height={100} />
                      </div>
                      <Logout />
                    </>
                  )}
                </div>
            </Container>
          </Navbar>
        </>
      );
    };
