import { useContext, useEffect, useState } from "react";
import { Button, Container, Dropdown, Image, Nav, Navbar } from "react-bootstrap";
import Login from "../components/onboarding/Login";
import { srcPriFixLocal } from "../helper/Helper";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";
import { axiosInstance, headers } from "../axios/axios-config";
import toast from "react-hot-toast";
import MainContext from "../context/Mcontext.context";
import ChangePassword from "./onboarding/ChangePassword";

function Header({ isContentLoading, setIsContentLoading }) {

    const [pageScroll, setPageScroll] = useState('');
    const { cartData } = useContext(MainContext)
    const [loginModalShow, setLoginModalShow] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const [changePasswordShow, setChangePasswordShow] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const logoutHandler = () => {
        Auth.logout()
        axiosInstance.get("auth/sign-out", { headers: headers }).then((res) => {
            if (res) {
                navigate('/')
                toast.success('Logout successfully.')
                setIsUserLoggedIn(false)
            }
        }).catch((error) => {
            // setLoading(false);
        });

    }

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
        setIsUserLoggedIn(Auth.isUserAuthenticated())

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
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="align-items-start">
                        <Nav className="ml-auto menu-bar position-relative">
                            <Nav.Link
                                onClick={() => navigate('/')}
                                className="mr-lg-5 mb-0 h4 align-self-lg-center">Home</Nav.Link >
                            <Nav.Link
                                onClick={() => {
                                    if (!isUserLoggedIn) {
                                        setLoginModalShow(true)
                                    } else {
                                        navigate('/product', {
                                            state: 'Sell/Share'
                                        })
                                    }
                                }}
                                className={`mr-lg-5 mb-0 h4 align-self-lg-center ${location?.state === 'Sell/Share' ? 'text-primary' : ''}`}>Sell/Share</Nav.Link>
                            <Nav.Link
                                onClick={() => alert('In progress')}
                                className="mr-lg-5 mb-0 h4 align-self-lg-center">Community</Nav.Link>
                            <Nav.Link
                                onClick={() => alert('In progress')}
                                className="mr-lg-5 mb-0 h4 align-self-lg-center">Library</Nav.Link>
                            {/* <Nav.Link
                                onClick={() => alert('In progress')}
                                className="mr-lg-5 mb-0 h4 align-self-lg-center">
                                My List
                            </Nav.Link> */}
                            <Dropdown className="position-relative mr-lg-5 mb-0 align-self-lg-center" drop={'start'}>
                                <Dropdown.Toggle variant="" className="profile-avtar  ml-4" drop={'start'}>
                                    <span className="h4">My List</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu drop={'start'} className="p-0">
                                    <Dropdown.Item
                                        onClick={() => {
                                            if (!isUserLoggedIn) {
                                                setLoginModalShow(true)
                                            } else {
                                                navigate('/account/order-history')
                                            }
                                        }}
                                        className="border-bottom py-2 pl-3">
                                        <i className='bx bxs-user-account'></i> Order History
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => {
                                            if (!isUserLoggedIn) {
                                                setLoginModalShow(true)
                                            } else {
                                                navigate('/account/sell-history')
                                            }
                                        }}
                                        className="border-bottom py-2 pl-3">
                                        <i className='bx bx-notepad'></i> Sell History
                                    </Dropdown.Item>

                                </Dropdown.Menu>
                            </Dropdown>
                            <Nav.Link onClick={() => navigate('/cart')} className="mr-lg-4  align-self-lg-center position-relative">
                                <span
                                    className="position-absolute bg-primary text-white rounded-circle text-center cart-count">
                                    {cartData?.length || 0}
                                </span>
                                <Image
                                    width="35"
                                    alt="cart kitaab Jun"
                                    src={`${srcPriFixLocal}cart-icon.png`}
                                />
                            </Nav.Link>
                            {!isUserLoggedIn ?
                                <Button
                                    type="button"
                                    onClick={() => setLoginModalShow(true)}
                                    className="btn btn-primary text-white px-3 ml-3 align-self-lg-center">
                                    <Image
                                        src={`${srcPriFixLocal}user-icon.svg`}
                                    />  Login
                                </Button>
                                :
                                <Dropdown className="position-relative pl-2" drop={'start'}>
                                    <Dropdown.Toggle variant="" className="profile-avtar ml-4" drop={'start'}>
                                        <Image
                                            className="rounded-circle"
                                            src={`${srcPriFixLocal}default-avatar.jpg`}
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu drop={'start'} className="p-0">
                                        <Dropdown.Item href="#/account/profile" className="border-bottom py-2 pl-3">
                                            <i className='bx bxs-user-account'></i> Account
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/account/chat" className="border-bottom py-2 pl-3">
                                            <i className='bx bx-chat'></i> Chat
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/account/wishlist" className="border-bottom py-2 pl-3">
                                            <i className='bx bx-heart'></i> Wish List
                                        </Dropdown.Item>
                                        {isUserLoggedIn &&
                                            <>
                                                <Dropdown.Item href="#/product/add" className="border-bottom py-2 pl-3">
                                                    <i className='bx bx-chat'></i> Add Product
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() => setChangePasswordShow(true)}
                                                    className="border-bottom py-2 pl-3">
                                                    <i className='bx bx-chat'></i> Change Password
                                                </Dropdown.Item>
                                            </>
                                        }

                                        <Dropdown.Item className="py-2 pl-3" onClick={logoutHandler}>
                                            <i className='bx bx-log-in-circle'></i> Logout
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <ChangePassword
                changePasswordShow={changePasswordShow}
                setChangePasswordShow={setChangePasswordShow} />

            <Login
                setIsContentLoading={setIsContentLoading}
                loginModalShow={loginModalShow}
                setIsUserLoggedIn={setIsUserLoggedIn}
                setLoginModalShow={setLoginModalShow} />
        </>
    )
}

export default Header;