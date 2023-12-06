import { useUserData } from '../context/userContext';
import Logout from './handleLogout';
import React, { useEffect } from 'react';
import { Image, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

export default function Header() {
  const { userId, isArtist, isUser, isLoggedIn, artistIdNew, profileData, artistProfileData } = useUserData();

  useEffect(() => {
  }, [artistIdNew]);

  return (
    <>
      <Navbar
        expand="lg"
        className="p-3 "
        style={{ backgroundColor: 'rgba(128, 60, 128, 0.3)', color: 'black', marginBottom: '10px', width: '100vw' }}
      >
        <Container fluid>
          <Navbar.Brand href={isLoggedIn ? "/home" : "/"} className="text-black text-decoration-none">
            <Image src="/logo.png" width={100} style={{ zIndex: "2" }} />
          </Navbar.Brand>

          {isLoggedIn && (
            <>
              <div className="d-flex align-items-center justify-content-center justify-content-lg-end col">
                <div style={{ borderRadius: '60px', border: '8px solid orange', overflow: 'hidden' }}>
                  <Image src={profileData || artistProfileData} width={100} height={100} />
                </div>
              </div>

              <Navbar.Toggle aria-controls="navbarNav" className="justify-content-end" />
              <Navbar.Collapse id="navbarNav" className="justify-content-between">
      
                <Nav className="me-auto">
                  <Nav.Link href="/home" style={{ color: "black" }}>
                    <h3>Home</h3>
                  </Nav.Link>
                  <Nav.Link href="/about" style={{ color: "black" }}>
                    <h3>About</h3>
                  </Nav.Link>
                  <Nav.Link href="/contact" style={{ color: "black" }}>
                    <h3>Contact</h3>
                  </Nav.Link>
                  {isUser && (
                    <Nav.Link href={`/user/${userId}`} style={{ color: "black" }}>
                      <h3>User Profile</h3>
                    </Nav.Link>
                  )}
                  {isArtist && (
                    <Nav.Link href={`/artist/${artistIdNew}`} style={{ color: "black" }}>
                      <h3>Artist Profile</h3>
                    </Nav.Link>
                  )}
                </Nav>
                <Logout />
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
}
