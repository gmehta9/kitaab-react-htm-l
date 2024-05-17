import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
// import Header from "../components/Header";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import Footer from "../../components/Footer";
import MainContext from "../../context/Mcontext.context";
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import ManageAddress from "../myAccount/ManageAddress";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../redux/authModalSlice";


function CartPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [addressModalShow, setAddressModalShow] = useState(false)
    // const [isInnerPageLoading, setIsInnerPageLoading] = useState(false)
    const { cartData, setCartData, cartBtnClick, setCartBtnClick } = useContext(MainContext)
    const { setIsContentLoading } = useOutletContext()

    const useLoggedIN = Auth.loggedInUser();

    const cartDeleteHandle = (obj, ii) => {

        if (Auth.isUserAuthenticated()) {
            setCartBtnClick(cartBtnClick + 1)
            const cd = cartData.filter((item) => (item.product_id || item.id) !== (obj.product_id || obj.id))
            setCartData(cd)
            // axiosInstance['delete']('cart/' + obj?.product_id || obj.id, {
            //     headers: {
            //         ...headers,
            //         ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            //     }
            // }).then((res) => {
            //     if (res) {
            //         const cd = cartData.filter((item) => (item.product_id || item.id) !== (obj.product_id || obj.id))
            //         setCartData(cd)
            //     }
            // }).catch((error) => { })
        } else {
            const cd = cartData.filter((item) => (item?.product_id || item?.id) !== (obj?.product_id || obj.id))
            setCartData(cd)
        }
    }

    // const cartQtyHandler = (event, object) => {
    //     const { value } = event.target
    //     const updateCart = cartData.map((cdItem) => {
    //         if ((cdItem?.product_id || cdItem?.id) === (object?.product_id || object.id) && +value !== 0) {
    //             cdItem.quantity = value
    //         }
    //         return cdItem
    //     })

    //     setCartData(updateCart)
    // }

    const orderPlacesHandler = (index) => {

        if (!useLoggedIN) {
            dispatch(openLoginModal())
            return
        }

        if (useLoggedIN?.is_address === "0") {
            setAddressModalShow(true)
            return
        }
        setIsContentLoading(true)
        const order = cartData.map(item => ({ product_id: item.id, quantity: item.quantity }));
        axiosInstance['post']('order',
            order
            // {
            //     order: order,
            //     // shipping_name
            //     // shipping_email
            //     // shipping_phone_no
            //     // shipping_address
            //     // shipping_state
            //     // shipping_city
            //     // shipping_pin_code
            //     // shipping_order_type
            // }
            , {

                headers: {
                    ...headers,
                    ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
                }
            }).then((res) => {
                if (res) {
                    toast.success("Order Placed successfully, Please check your email", {
                        duration: 5000
                    });
                    setIsContentLoading(false)
                    navigate('/account/order-history')
                    setCartData([])
                }
            }).catch((error) => {
                setIsContentLoading(false)
            })
    }
    return (
        <>
            {/* <Header isContentLoading={isInnerPageLoading} setIsContentLoading={setIsInnerPageLoading} /> */}
            <div className="inner-pages row border-top ">
                <Container className="my-5">

                    <Row>
                        <Col lg={12}>
                            <div className="h2 font-weight-bold">
                                Cart
                            </div>
                        </Col>

                        <Col lg={12}>
                            <Table striped bordered >

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Book Name</th>
                                        <th>Author</th>
                                        <th>Transact Type</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cartData?.length === 0 &&
                                        <tr>
                                            <td colSpan={5} className="text-center">Cart is Empty</td>
                                        </tr>
                                    }

                                    {cartData?.map((catData, index) =>
                                        <tr key={index + 'catdata'}>
                                            <td>{index + 1}</td>
                                            <td className="text-capitalize">{catData?.title || catData?.product?.title}</td>
                                            <td className="text-capitalize">
                                                {catData?.auther || catData?.product.auther}
                                                {/* <input
                                                    style={{ width: '70px' }}
                                                    type="number"
                                                    max={catData?.transact_type === 'sell' ? 10 : undefined}
                                                    min="1"
                                                    value={catData.quantity || 1}
                                                    name="qty"
                                                    onChange={(targetValue) => cartQtyHandler(targetValue, catData)}
                                                /> */}
                                            </td>
                                            <td className="text-capitalize">{catData?.transact_type || catData?.product?.transact_type}</td>
                                            <td>
                                                {(catData?.transact_type || catData?.product?.transact_type) === 'sell' ?
                                                    (catData?.sale_price || catData?.product?.sale_price) || (catData?.price || catData?.product?.price)
                                                    : '0'
                                                }

                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => cartDeleteHandle(catData)}
                                                    className="btn p-0 border-0 bg-transparent">
                                                    <img src="./assets/images/delete_icon.svg" alt="" />
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Col>

                        <Col lg={12} className="text-right mt-4">
                            <Button
                                disabled={cartData?.length === 0}
                                className="ml-auto"
                                onClick={() => {
                                    if (!useLoggedIN) {
                                        dispatch(openLoginModal())
                                        return
                                    }
                                    setAddressModalShow(true)
                                }
                                    // orderPlacesHandler
                                }
                                variant="dark">Proceed</Button>
                            {/* Place Your Order */}
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>

            <ManageAddress
                cartData={cartData}
                addressModalShow={addressModalShow}
                setAddressModalShow={setAddressModalShow} />

        </>
    )
}

export default CartPage;