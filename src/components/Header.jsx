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
                    <Navbar.Collapse id="basic-navbar-nav" className="align-items-start">
                        <Nav className="ml-auto menu-bar">
                            <Nav.Link href="/" className="mr-4 align-self-center">Home</Nav.Link>
                            <Nav.Link href="" className="mr-4 align-self-center">Sell</Nav.Link>
                            <Nav.Link href="" className="mr-4 align-self-center">Share</Nav.Link>
                            <Nav.Link href="" className="mr-4 align-self-center">My List</Nav.Link>
                            <Nav.Link href="" className="mr-4 align-self-center position-relative">
                                <span
                                    className="position-absolute bg-primary text-white rounded-circle text-center cart-count">
                                    0
                                </span>
                                <Image width="35" alt="cart kitaab Jun" src="./assets/images/cart-icon.png" />
                            </Nav.Link>

                            <Nav.Link
                                href="#link"
                                className="btn btn-primary text-white px-3 ml-3 align-self-center">
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