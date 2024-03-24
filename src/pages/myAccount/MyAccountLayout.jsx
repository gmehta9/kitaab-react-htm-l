import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { useEffect } from "react";
import Auth from "../../auth/Auth";

function MyAccountLayoutPage() {
    const navigate = useNavigate();
    const location = useLocation()

    const getPageTitle = (pageSulg) => {
        let ps = ''
        switch (pageSulg) {
            case '/account/order-history':
                ps = 'Order History'
                break;
            case '/account/sell-history':
                ps = 'Sell History'
                break;
            case '/account/profile':
                ps = 'Profile'
                break;
            default:
                break;
        }

        return ps
    }
    useEffect(() => {
        if (!Auth.isUserAuthenticated()) {
            navigate('/')
        }
    }, [])
    return (
        <div className="inner-pages row border-top ">
            <Container className="my-5">
                <Row>
                    <Col lg={3} className="account-sidebar border-right">
                        <div className="account-sidebar-item">
                            <div className="account-sidebar-item-heading d-flex">
                                <i className='bx bxs-user align-self-center' ></i> Account Settings</div>
                            <ul className="pb-3 mb-4">
                                <li
                                    className={`${location.pathname === '/account/profile' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/profile')}
                                >
                                    Profile Information
                                </li>
                                {/* <li
                                    className={`${location.pathname === '/account/manage-address' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/manage-address')}>Manage Address</li> */}
                            </ul>
                        </div>
                        <div className="account-sidebar-item">
                            <div className="account-sidebar-item-heading d-flex">
                                <i className='bx bxs-user-detail'></i> My Stuff</div>
                            <ul className=" border-0">
                                {/* <li
                                    className={`${location.pathname === '/account/my-coupons' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/my-coupons')}>My Coupons</li>
                                <li
                                    className={`${location.pathname === '/account/my-reviews-ratings' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/my-reviews-ratings')}>My Reviews & Ratings</li> */}
                                <li
                                    className={`${location.pathname === '/account/order-history' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/order-history')}>Order History</li>
                                <li
                                    className={`${location.pathname === '/account/sell-history' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/sell-history')} >Sell History</li>
                            </ul>
                        </div>
                    </Col>
                    <Col lg={9}>
                        <h5 className="font-weight-bold">{getPageTitle(location?.pathname)}</h5>
                        <Outlet />
                    </Col>
                </Row>


            </Container>
            <Footer />
        </div>
    )
}

export default MyAccountLayoutPage;