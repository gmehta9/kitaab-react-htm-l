import { useEffect, useState } from "react";
import { Container, Image, Nav, Navbar } from "react-bootstrap";

function Header() {
    const [pageScroll, setPageScroll] = useState('')
    useEffect(() => {
        window.addEventListener("scroll", (event) => {
            console.log(window.scrollY);
            if (window.scrollY > 100) {
                setPageScroll('page-scrolled')
            } else {
                setPageScroll('')
            }
        });
        return () => window.removeEventListener("scroll", () => { })
    }, [])
    return (
        <>
            <Navbar expand="lg" className={`bg-transparent fixed-top top-0 ${pageScroll}`}>
                <Container>
                    <Navbar.Brand href="/">
                        <Image
                            src="./assets/images/KJ-Logo-(1).png"
                            className="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto menu-bar">
                            <Nav.Link href="/" className="mr-4">Home</Nav.Link>
                            <Nav.Link href="" className="mr-4">Sell</Nav.Link>
                            <Nav.Link href="" className="mr-4">Share</Nav.Link>
                            <Nav.Link href="" className="mr-4">My List</Nav.Link>

                            <Nav.Link
                                href="#link"
                                className="btn btn-primary text-white px-3 ml-3">
                                <Image src="./assets/images/user-icon.svg" />  Login
                            </Nav.Link>

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;