import { useEffect, useState } from "react";
import { Container, Image, Navbar } from "react-bootstrap";
import Login from "../components/onboarding/Login";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";
import ChangePassword from "./onboarding/ChangePassword";

import Menu from "./Menu";
import './menu.scss';

function Header({ setIsContentLoading, isUserLoggedIn, setIsUserLoggedIn }) {

    const [pageScroll, setPageScroll] = useState('');
    const [changePasswordShow, setChangePasswordShow] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [menuShow, setMenuShow] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("scroll", (event) => {
            if (window.scrollY > 50) {
                setPageScroll('page-scrolled')
            } else {
                setPageScroll('')
            }
        });
        return () => window.removeEventListener("scroll", () => { })
    }, [])

    useEffect(() => {
        if (window.innerWidth < 990) {
            setMobileMenu(true)
        }
        window.addEventListener("resize", (event) => {
            if (window.innerWidth < 990) {
                setMobileMenu(true)
            } else {
                setMobileMenu(false)
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
                            src={`${import.meta.env.VITE_MEDIA_LOCAL_URL}KJ-Logo-(1).png`}
                            className="logo" />
                    </Navbar.Brand>
                    {/* <Navbar.Toggle></Navbar.Toggle> */}
                    <button onClick={() => setMenuShow(!menuShow)} className="menu-toggle d-flex d-lg-none d-xl-none">
                        {menuShow ?
                            <i className='bx bx-x'></i>
                            :
                            <i className='bx bx-menu'></i>
                        }
                    </button>

                    <Menu
                        isUserLoggedIn={isUserLoggedIn}
                        setMenuShow={setMenuShow}
                        setIsUserLoggedIn={setIsUserLoggedIn}
                        setChangePasswordShow={setChangePasswordShow}
                        className={`${mobileMenu ? `for-mobile ${menuShow ? 'active' : ''}` : ''}`}
                        meanuID={`${mobileMenu ? 'sidebar-mobile' : ''}`}
                    />
                </Container>
            </Navbar>

            {/* <Menu
                isUserLoggedIn={isUserLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                setChangePasswordShow={setChangePasswordShow}
                className='for-mobile active'
                meanuID="sidebar-mobile "
            /> */}

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