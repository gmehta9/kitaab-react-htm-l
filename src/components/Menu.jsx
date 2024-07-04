import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Dropdown, Image, Modal, Nav, Navbar } from "react-bootstrap";
import { srcPriFixLocal } from "../helper/Helper";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";
import { axiosInstance, headers } from "../axios/axios-config";
import toast from "react-hot-toast";
import MainContext from "../context/Mcontext.context";
import { openLoginModal } from "../redux/authModalSlice";
import { useDispatch } from "react-redux";

function Menu({ className, isUserLoggedIn, setIsUserLoggedIn, setChangePasswordShow, meanuID, setMenuShow }) {

    const { cartData } = useContext(MainContext)
    const loggedInUser = Auth.loggedInUser()
    const dispatch = useDispatch();

    const location = useLocation();
    const navigate = useNavigate();

    const [comingSoon, setCominingSoon] = useState(false)

    const handleLoginClick = () => {
        dispatch(openLoginModal());
    };
    const logoutHandler = useCallback(() => {

        // Auth.logout()
        axiosInstance.get("auth/sign-out", {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((res) => {
            if (res) {
                Auth.logout()
                navigate('/')
                toast.success('Logout successfully.')
                setIsUserLoggedIn(false)
            }
        }).catch((error) => {
            Auth.logout()
            navigate('/')
            setIsUserLoggedIn(false)
            // setLoading(false);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserLoggedIn])

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
            <Navbar.Collapse id={meanuID} className={`align-items-start ${className}`}>
                {meanuID &&
                    <Navbar.Brand
                        className="mobile-logo"
                        onClick={() => {
                            navigate('/')
                            setMenuShow(false)
                        }}>
                        <Image
                            src={`${srcPriFixLocal}KJ-Logo-(1).png`}
                            className="logo" />
                    </Navbar.Brand>
                }
                <Nav className="ml-auto menu-bar position-relative">
                    <Nav.Link
                        onClick={() => {
                            navigate('/')
                            setMenuShow(false);
                        }}
                        className="mr-lg-5 mb-0 h4 align-self-lg-center">Home</Nav.Link >
                    <Nav.Link
                        onClick={() => {
                            setMenuShow(false);
                            if (!isUserLoggedIn) {
                                handleLoginClick()
                            } else {
                                navigate('/product', {
                                    state: 'Sell/Share'
                                })
                            }
                        }}
                        className={`mr-lg-5 mb-0 h4 align-self-lg-center ${location?.state === 'Sell/Share' ? 'text-primary' : ''}`}>Sell/Share</Nav.Link>
                    <Nav.Link
                        onClick={() => setCominingSoon(true)}
                        className="mr-lg-5 mb-0 h4 align-self-lg-center">Community</Nav.Link>
                    <Nav.Link
                        onClick={() => setCominingSoon(true)}
                        className="mr-lg-5 mb-0 h4 align-self-lg-center">Library</Nav.Link>
                    {/* <Nav.Link
                                onClick={() => alert('In progress')}
                                className="mr-lg-5 mb-0 h4 align-self-lg-center">
                                My List
                            </Nav.Link> */}
                    <Dropdown className="position-relative mr-lg-5 mb-0 align-self-lg-center dowpdown-section" drop={'start'}>
                        <Dropdown.Toggle variant="" className="dowpdown-section-btn1  ml-4" drop={'start'}>
                            <span className="h4">My List</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-0 dropdown-menu-right">
                            <Dropdown.Item
                                onClick={() => {
                                    if (!isUserLoggedIn) {
                                        handleLoginClick()
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
                                        handleLoginClick()
                                    } else {
                                        navigate('/account/sell-history')
                                    }
                                }}
                                className="border-bottom py-2 pl-3">
                                <i className='bx bx-notepad'></i> Sell History
                            </Dropdown.Item>
                            {/* <Dropdown.Item
                                onClick={() => setCominingSoon(true)}
                                className="border-bottom py-2 pl-3">
                                <i className='bx bx-chat'></i> Chat
                            </Dropdown.Item> */}
                            <Dropdown.Item
                                onClick={() => {
                                    if (!isUserLoggedIn) {
                                        handleLoginClick()
                                    } else {
                                        navigate('/account/wishlist')
                                    }
                                }}
                                className="border-bottom py-2 pl-3">
                                <i className='bx bx-heart'></i> Wish List
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Nav.Link
                        onClick={() => {
                            setMenuShow(false);
                            navigate('/cart')
                        }}
                        className="mr-lg-4  align-self-lg-center position-relative">
                        <span className="position-relative">
                            <span
                                className="position-absolute bg-primary text-white rounded-circle text-center cart-count">
                                {cartData?.length || 0}
                            </span>
                            <Image
                                width="35"
                                alt="cart kitaab Jun"
                                src={`${srcPriFixLocal}cart-icon.png`}
                            />
                        </span>
                    </Nav.Link>
                    {!isUserLoggedIn ?
                        <Button
                            type="button"
                            onClick={() => handleLoginClick()}
                            className="btn btn-primary text-white px-3 ml-3 align-self-lg-center login">
                            <Image
                                src={`${srcPriFixLocal}user-icon.svg`}
                            />  Login
                        </Button>
                        :
                        <Dropdown className="position-relative pl-2 dropdown-section-myaccount" drop={'start'}>
                            <Dropdown.Toggle variant="" className="dropdown-section-btn2 ml-4" drop={'start'}>
                                <Image
                                    className="rounded-circle"
                                    src={`${srcPriFixLocal}default-avatar.jpg`}
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu align="start" className="p-0 dropdown-menu-right">
                                <div
                                    className="pl-3 mt-2 mb-2 text-primary text-capitalize text-truncate" style={{ width: '195px' }}>
                                    Hello, {loggedInUser.name}
                                </div>
                                <Dropdown.Item href="#/account/profile" className="border-bottom py-2 pl-3">
                                    <i className='bx bxs-user-account'></i> Account
                                </Dropdown.Item>
                                {/* <Dropdown.Item href="#/account/chat" className="border-bottom py-2 pl-3">
                                    <i className='bx bx-chat'></i> Chat
                                </Dropdown.Item>
                                <Dropdown.Item href="#/account/wishlist" className="border-bottom py-2 pl-3">
                                    <i className='bx bx-heart'></i> Wish List
                                </Dropdown.Item> */}
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
            <Modal
                show={comingSoon}
                centered
                onHide={() => setCominingSoon(!comingSoon)}>
                <button
                    style={{
                        display: 'flex',
                        width: '40px',
                        position: 'absolute',
                        right: '0'
                    }}
                    className="btn " onClick={() => setCominingSoon(!comingSoon)} >✖</button>
                <Image className="w-100" src="./assets/images/coming-soon.jpg" />
            </Modal>
        </>
    )
}

export default Menu;