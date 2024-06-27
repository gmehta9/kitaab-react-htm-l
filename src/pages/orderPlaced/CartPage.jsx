// import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
// import Header from "../components/Header";
// import toast from "react-hot-toast";
import { useContext, useState } from "react";
import Footer from "../../components/Footer";
import MainContext from "../../context/Mcontext.context";
// import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import ManageAddress from "../myAccount/ManageAddress";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../redux/authModalSlice";
import toast from "react-hot-toast";
import { Link, useNavigate, useOutletContext } from "react-router-dom";


function CartPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [addressModalShow, setAddressModalShow] = useState(false)

    const { cartData, setCartData, cartBtnClick, setCartBtnClick, isCartLoading } = useContext(MainContext)
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

    const proccedNextHandler = () => {
        if (!useLoggedIN) {
            dispatch(openLoginModal())
            return
        }
        const isOrderReadyAvaible = cartData.some(item => (item.isReadyForOrder));

        if (!isOrderReadyAvaible) {
            toast.error("No product selected in the cart for place order!", {
                duration: 4000
            });
            return
        }
        setAddressModalShow(true)
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

    // const orderPlacesHandler = (index) => {

    //     if (!useLoggedIN) {
    //         dispatch(openLoginModal())
    //         return
    //     }

    //     if (useLoggedIN?.is_address === "0") {
    //         setAddressModalShow(true)
    //         return
    //     }
    //     setIsContentLoading(true)
    //     const order = cartData.map(item => ({ product_id: item.id, quantity: item.quantity }));
    //     axiosInstance['post']('order',
    //         order
    //         // {
    //         //     order: order,
    //         //     // shipping_name
    //         //     // shipping_email
    //         //     // shipping_phone_no
    //         //     // shipping_address
    //         //     // shipping_state
    //         //     // shipping_city
    //         //     // shipping_pin_code
    //         //     // shipping_order_type
    //         // }
    //         , {

    //             headers: {
    //                 ...headers,
    //                 ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
    //             }
    //         }).then((res) => {
    //             if (res) {
    //                 toast.success("Order Placed successfully, Please check your email", {
    //                     duration: 5000
    //                 });
    //                 setIsContentLoading(false)
    //                 navigate('/account/order-history')
    //                 setCartData([])
    //             }
    //         }).catch((error) => {
    //             setIsContentLoading(false)
    //         })
    // }

    const isReadyHandler = (event, cd) => {
        console.log(cd);
        const { checked } = event.target
        const updateCart = cartData.map(item => {
            if ((item?.product_id || item.id) === (cd?.product_id || cd?.id) || cd === 'all') {
                item.isReadyForOrder = checked
            }
            return item
        })
        setCartData(updateCart)
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
                                        <th>
                                            <div className="form-check">
                                                <label className="check-box-container">
                                                    <input type="checkbox"
                                                        onChange={(event) => isReadyHandler(event, 'all')}
                                                    // checked={catData.isReadyForOrder}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </th>
                                        <th>#</th>
                                        <th>Book Name</th>
                                        <th>Author</th>
                                        <th>Transact Type</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {!isCartLoading && cartData?.length === 0 &&
                                        <tr>
                                            <td colSpan={6} className="text-center">Cart is Empty</td>
                                        </tr>
                                    }
                                    {isCartLoading && cartData?.length === 0 &&
                                        <tr>
                                            <td colSpan={6} className="text-center">
                                                <Spinner
                                                    className="mx-auto"
                                                    animation="border"
                                                    variant="secondary" />
                                            </td>
                                        </tr>
                                    }

                                    {!isCartLoading && cartData?.map((catData, index) =>
                                        <tr key={index + 'catdata'}>
                                            <td>
                                                <div className="form-check">
                                                    <label className="check-box-container">
                                                        <input type="checkbox"
                                                            onChange={(event) => isReadyHandler(event, catData)}
                                                            checked={catData.isReadyForOrder}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>

                                                </div>
                                            </td>
                                            <td>{index + 1}</td>
                                            <td className="text-capitalize">
                                                <span
                                                    className="text-primary"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        navigate('/product/product-detail', {
                                                            state: {
                                                                productId: catData.product_id
                                                            }
                                                        })
                                                    }}>
                                                    {catData?.title || catData?.product?.title}{catData.product_id}
                                                </span>
                                            </td>
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
                                    proccedNextHandler()
                                }
                                    // orderPlacesHandler
                                }
                                variant="dark">Proceed</Button>
                            {/* Place Your Order */}
                        </Col>
                    </Row>
                </Container>
                {/* <Footer /> */}
            </div>

            <ManageAddress
                cartData={cartData}
                setCartData={setCartData}
                setCartBtnClick={setCartBtnClick}
                addressModalShow={addressModalShow}
                setAddressModalShow={setAddressModalShow}
                setIsContentLoading={setIsContentLoading} />

        </>
    )
}

export default CartPage;