import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

function MyAccountLayout() {
    const navigate = useNavigate();
    const location = useLocation()
    return (
        <div className="inner-pages row border-top ">
            <Container className="my-5">
                <Row>
                    <Col lg={3} className="account-sidebar border-right">
                        <div className="account-sidebar-item">
                            <div className="account-sidebar-item-heading d-flex">
                                <i class='bx bxs-user align-self-center' ></i> Account Settings</div>
                            <ul className="pb-3 mb-4">
                                <li
                                    class={`${location.pathname === '/account/profile' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/profile')}
                                >Profile Information</li>
                                <li
                                    class={`${location.pathname === '/account/manage-address' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/manage-address')}
                                >Manage Address</li>
                            </ul>
                        </div>
                        <div className="account-sidebar-item">
                            <div className="account-sidebar-item-heading d-flex">
                                <i class='bx bxs-user-detail'></i> My Stuff</div>
                            <ul className=" border-0">
                                <li
                                    class={`${location.pathname === '/account/my-coupons' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/my-coupons')}>My Coupons</li>
                                <li
                                    class={`${location.pathname === '/account/my-reviews-ratings' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/my-reviews-ratings')}>My Reviews & Ratings</li>
                                <li
                                    class={`${location.pathname === '/account/order-history' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/order-history')}>Order History</li>
                                <li
                                    class={`${location.pathname === '/account/wishlist' ? 'text-primary' : ''} clickable`}
                                    onClick={() => navigate('/account/wishlist')} >My Wishlist</li>
                            </ul>
                        </div>
                    </Col>
                    <Col lg={9}>
                        <Outlet />
                    </Col>
                </Row>


            </Container>
            <Footer />
        </div>
    )
}

export default MyAccountLayout;