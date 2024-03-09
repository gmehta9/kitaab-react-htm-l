import { useEffect, useState } from "react";
import { Button, Container, Dropdown, Image, Nav, Navbar } from "react-bootstrap";
import Login from "../pages/onboarding/Login";
import { srcPriFixLocal } from "../helper/Helper";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";

function Header() {
    const [pageScroll, setPageScroll] = useState('');
    const [loginModalShow, setLoginModalShow] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const logoutHandler = () => {
        Auth.logout()
    }

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

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <>
            <Navbar expand="lg" className={`bg-transparent fixed-top top-0 ${pageScroll}`}>
                <Container fluid>
                    <Navbar.Brand
                        onClick={() => navigate('/')}>
                        <Image
                            src={`${srcPriFixLocal}KJ-Logo-(1).png`}
                            className="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="align-items-start">
                        <Nav className="ml-auto menu-bar position-relative">
                            <Nav.Link
                                onClick={() => navigate('/')}
                                className="mr-5 mb-0 h4 align-self-center">Home</Nav.Link >
                            <Nav.Link
                                onClick={() => navigate('/product')}
                                className="mr-5 mb-0 h4 align-self-center">Sell/Share</Nav.Link>
                            <Nav.Link
                                onClick={() => alert('In progress')}
                                className="mr-5 mb-0 h4 align-self-center">Community</Nav.Link>
                            <Nav.Link
                                onClick={() => alert('In progress')}
                                className="mr-5 mb-0 h4 align-self-center">Library</Nav.Link>
                            <Nav.Link
                                onClick={() => alert('In progress')}
                                className="mr-5 mb-0 h4 align-self-center">My List</Nav.Link>
                            <Nav.Link href="" className="mr-4  align-self-center position-relative">
                                <span
                                    className="position-absolute bg-primary text-white rounded-circle text-center cart-count">
                                    0
                                </span>
                                <Image
                                    width="35"
                                    alt="cart kitaab Jun"
                                    src={`${srcPriFixLocal}cart-icon.png`}
                                />
                            </Nav.Link>
                            {!Auth.isUserAuthenticated() ?
                                <Button
                                    type="button"
                                    onClick={() => setLoginModalShow(true)}
                                    className="btn btn-primary text-white px-3 ml-3 align-self-center">
                                    <Image
                                        src={`${srcPriFixLocal}user-icon.svg`}
                                    />  Login
                                </Button>
                                :
                                <Dropdown className="position-relative pl-2" drop={'end'}>
                                    <Dropdown.Toggle variant="" className="profile-avtar ml-4" drop={'end'}>
                                        <Image
                                            className="rounded-circle"
                                            src="https://avatars.githubusercontent.com/u/872310?v=4"
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu drop={'end'} className="p-0">
                                        <Dropdown.Item href="#/account/profile" className="border-bottom py-2 pl-3">
                                            <i class='bx bxs-user-account'></i> Account
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/account/order-history" className="border-bottom py-2 pl-3">
                                            <i class='bx bx-notepad'></i> Order History
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/account/chat" className="border-bottom py-2 pl-3">
                                            <i class='bx bx-chat'></i> Chat
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/account/wishlist" className="border-bottom py-2 pl-3">
                                            <i class='bx bx-bookmark'></i> Wishlist
                                        </Dropdown.Item>
                                        <Dropdown.Item className="py-2 pl-3" onClick={logoutHandler}>
                                            <i class='bx bx-log-in-circle'></i> Logout
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Login loginModalShow={loginModalShow} setLoginModalShow={setLoginModalShow} />
        </>
    )
}

export default Header;