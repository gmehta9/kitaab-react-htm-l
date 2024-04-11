import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import MainContext from "../context/Mcontext.context";
import { axiosInstance, headers } from "../axios/axios-config";
import Auth from "../auth/Auth";
import ManageAddress from "./myAccount/ManageAddress";


function CartPage() {
    const navigate = useNavigate()
    const [addressModalShow, setAddressModalShow] = useState(false)
    const [isContentLoading, setIsContentLoading] = useState(false)
    const { cartData, setCartData } = useContext(MainContext)
    const useLoggedIN = Auth.loggedInUser()
    const cartDeleteHandle = (id, ii) => {
        console.log(id);
        axiosInstance['delete']('cart/' + id.product_id || id, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((res) => {
            if (res) {
                const cd = cartData.filter((item) => (item.product_id || item.id) !== (id.product_id || id))
                setCartData(cd)
            }
        }).catch((error) => { })
    }

    const cartQtyHandler = (index) => {

    }
    const orderPlacesHandler = (index) => {
        if (useLoggedIN.is_address === "0") {
            setAddressModalShow(true)
            return
        }
        const order = cartData.map(item => ({ product_id: item.id, quantity: item.quantity }));
        axiosInstance['post']('order', order, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((res) => {
            if (res) {
                toast.success("Order Placed successfully, Please check your email", {
                    duration: 5000
                });
                navigate('/account/order-history')
                setCartData([])
            }
        }).catch((error) => { })
    }

    useEffect(() => {
        console.log(useLoggedIN.is_address);

    }, [])
    return (
        <>
            <Header
                isContentLoading={isContentLoading}
                setIsContentLoading={setIsContentLoading}
            />


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
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cartData?.length === 0 &&
                                        <tr>
                                            <td colSpan={4} className="text-center">Cart is Empty</td>
                                        </tr>
                                    }

                                    {cartData?.map((catData, index) =>
                                        <tr key={index + 'catdata'}>
                                            <td>{index + 1}</td>
                                            <td>{catData?.title || catData?.product?.title}</td>
                                            <td>
                                                <input
                                                    style={{ width: '70px' }}
                                                    type="number"
                                                    max={catData?.transact_type === 'sell' ? 10 : undefined}
                                                    min="0"
                                                    value={catData.quantity || 1}
                                                    name="qty"
                                                    onChange={(targetValue) => cartQtyHandler(index)}
                                                />
                                            </td>
                                            <td>
                                                {(catData?.transact_type || catData?.product?.transact_type) === 'sell' ?
                                                    (catData?.sale_price || catData?.product?.sale_price) || (catData?.price || catData?.product?.price)
                                                    : 'Sharing for 60 days'
                                                }

                                            </td>
                                            <td>
                                                <button onClick={() => cartDeleteHandle(catData)} className="btn p-0 border-0 bg-transparent">
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
                                onClick={orderPlacesHandler}
                                variant="dark">Proceed</Button>

                        </Col>

                    </Row>

                </Container>

                <Footer />
            </div>

            <ManageAddress
                addressModalShow={addressModalShow}
                setAddressModalShow={setAddressModalShow} />
        </>
    )
}

export default CartPage;