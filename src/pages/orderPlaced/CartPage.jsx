import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import MainContext, { getProductId, getProduct } from "../../context/Mcontext.context";
import Auth from "../../auth/Auth";
import ManageAddress from "../myAccount/ManageAddress";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../redux/authModalSlice";
import toast from "react-hot-toast";
import { useNavigate, useOutletContext } from "react-router-dom";


function CartPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [addressModalShow, setAddressModalShow] = useState(false)

    const { cartData, setCartData, cartBtnClick, setCartBtnClick, isCartLoading, refreshCart } = useContext(MainContext)
    const { setIsContentLoading } = useOutletContext()

    const useLoggedIN = Auth.loggedInUser();

    const cartDeleteHandle = (obj) => {
        const objProductId = getProductId(obj);
        if (Auth.isUserAuthenticated()) {
            setCartBtnClick(cartBtnClick + 1)
        }
        const cd = cartData.filter((item) => getProductId(item) !== objProductId)
        setCartData(cd)
    }

    const proccedNextHandler = () => {
        if (!useLoggedIN) {
            dispatch(openLoginModal())
            return
        }
        const isOrderReadyAvaible = cartData.some(item => item.isReadyForOrder);

        if (!isOrderReadyAvaible) {
            toast.error("No product selected in the cart for place order!", {
                duration: 4000
            });
            return
        }

        // Ensure cart items have _id from server before placing order
        const hasMissingIds = cartData.some(item => item.isReadyForOrder && !item._id);
        if (hasMissingIds) {
            toast("Syncing cart, please try again...", { duration: 2000 });
            refreshCart();
            return
        }

        setAddressModalShow(true)
    }

    const isReadyHandler = (event, cd) => {
        const { checked } = event.target
        const updateCart = cartData.map(item => {
            if (cd === 'all' || getProductId(item) === getProductId(cd)) {
                item.isReadyForOrder = checked
            }
            return item
        })
        setCartData(updateCart)
    }

    useEffect(() => {
        document.title = 'My Cart | Kitaab Juction';
    }, []);

    return (
        <>
            <div className="inner-pages row border-top">
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
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {!isCartLoading && cartData?.length === 0 &&
                                        <tr>
                                            <td colSpan={7} className="text-center">Cart is Empty</td>
                                        </tr>
                                    }
                                    {isCartLoading && cartData?.length === 0 &&
                                        <tr>
                                            <td colSpan={7} className="text-center">
                                                <Spinner
                                                    className="mx-auto"
                                                    animation="border"
                                                    variant="secondary" />
                                            </td>
                                        </tr>
                                    }

                                    {!isCartLoading && cartData?.map((cartItem, index) => {
                                        const product = getProduct(cartItem);
                                        const productId = getProductId(cartItem);

                                        return (
                                            <tr key={cartItem._id || cartItem.id || index}>
                                                <td>
                                                    <div className="form-check">
                                                        <label className="check-box-container">
                                                            <input type="checkbox"
                                                                onChange={(event) => isReadyHandler(event, cartItem)}
                                                                checked={cartItem.isReadyForOrder}
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
                                                                    productId: productId
                                                                }
                                                            })
                                                        }}>
                                                        {product?.title}
                                                    </span>
                                                </td>
                                                <td className="text-capitalize">
                                                    {product?.auther}
                                                </td>
                                                <td className="text-capitalize">{product?.transact_type}</td>
                                                <td>
                                                    {product?.transact_type === 'sell'
                                                        ? (product?.sale_price || product?.price || '0')
                                                        : '0'
                                                    }
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => cartDeleteHandle(cartItem)}
                                                        className="btn p-0 border-0 bg-transparent">
                                                        <img
                                                            src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}delete_icon.svg`}
                                                            alt="delete"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>

                        <Col lg={12} className="text-right mt-4">
                            <Button
                                disabled={cartData?.length === 0}
                                className="ml-auto"
                                onClick={proccedNextHandler}
                                variant="dark">Proceed</Button>
                        </Col>
                    </Row>
                </Container>
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
