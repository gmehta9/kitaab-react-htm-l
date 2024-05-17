import { useEffect, useState } from "react";
import { Container, Image, Navbar, Offcanvas } from "react-bootstrap";
import Login from "../components/onboarding/Login";
import { srcPriFixLocal } from "../helper/Helper";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";
import ChangePassword from "./onboarding/ChangePassword";

import Menu from "./Menu";

function Header({ setIsContentLoading, isUserLoggedIn, setIsUserLoggedIn }) {

    const [pageScroll, setPageScroll] = useState('');
    const [changePasswordShow, setChangePasswordShow] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("scroll", (event) => {
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

    useEffect(() => {
        if (setIsUserLoggedIn) {
            setIsUserLoggedIn(Auth.isUserAuthenticated())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Auth.loggedInUser])

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
                    <Navbar.Toggle></Navbar.Toggle>
                    {/* <button onClick={() => setShow(true)} className="menu-toggle d-flex d-lg-none d-xl-none">
                        <i class='bx bx-menu'></i>
                    </button> */}
                    <Menu
                        isUserLoggedIn={isUserLoggedIn}
                        setIsUserLoggedIn={setIsUserLoggedIn}
                        setChangePasswordShow={setChangePasswordShow}
                    // className='for-mobile active'
                    // meanuID="sidebar-mobile "
                    />
                </Container>
            </Navbar>

            <ChangePassword
                changePasswordShow={changePasswordShow}
                setChangePasswordShow={setChangePasswordShow} />

            <Login
                setIsContentLoading={setIsContentLoading}
                setIsUserLoggedIn={setIsUserLoggedIn}
            />
        </>
    )
}

export default Header;