import { useEffect, useState, useCallback, useRef } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ManageAddress({ setAddressModalShow, addressModalShow, setCartData, setCartBtnClick, cartData, setIsContentLoading }) {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({ mode: 'onChange' });
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    // Refs
    const isMounted = useRef(true);
    const initialLoadDone = useRef(false);

    // Watch shipping state
    const watchedShippingState = watch('shipping_state');

    const handleClose = useCallback(() => {
        setAddressModalShow(false);
    }, [setAddressModalShow]);

    // Order handler
    const orderPlacesHandler = useCallback(async (data) => {
        const order = cartData.filter(cd => cd.isReadyForOrder).map(item => item.id);

        if (!order || order.length === 0) {
            toast.error("No order Selected in cart!", { duration: 2000 });
            return;
        }

        setIsContentLoading(true);
        try {
            const res = await axiosInstance.post('order', {
                ...data,
                shipping_price: getValues('shipping_order_type') === 'self_pickup' ? '20' : '40',
                cart_ids: order
            });

            if (res && isMounted.current) {
                toast.success("Order Placed successfully, Please check your email.", { duration: 5000 });
                setCartBtnClick(prev => prev + 10);
                setCartData(cartData.filter(cd => !cd.isReadyForOrder).map(item => ({
                    product_id: item.product_id,
                    quantity: 1
                })));
                handleClose();
                navigate('/account/order-history');
            }
        } catch (error) {
            console.error('Order placement failed');
        } finally {
            if (isMounted.current) {
                setIsContentLoading(false);
            }
        }
    }, [cartData, getValues, handleClose, navigate, setCartBtnClick, setCartData, setIsContentLoading]);

    // Profile address handler
    const loadProfileAddress = useCallback(async (stateListData) => {
        try {
            const response = await axiosInstance.get('auth/profile');
            if (response && isMounted.current) {
                const user = response?.data;

                // Find cities for user's state
                const stateData = stateListData.find(s => s.value === user?.state);
                if (stateData) {
                    setCityList(stateData.cities || []);
                }

                setValue('shipping_name', user?.name);
                setValue('shipping_phone_no', user?.phone_number);
                setValue('shipping_email', user?.email);
                setValue('shipping_city', user?.city);
                setValue('shipping_state', user?.state);
                setValue('shipping_address', user?.address);
                setValue('shipping_pin_code', user?.pin_code);
            }
        } catch (error) {
            console.error('Failed to load profile');
        }
    }, [setValue]);

    // Initial load
    useEffect(() => {
        isMounted.current = true;

        if (!initialLoadDone.current) {
            initialLoadDone.current = true;

            fetch('/cityState.json', {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
                .then(res => res.json())
                .then(data => {
                    if (isMounted.current) {
                        setStateList(data || []);
                        if (Auth.isUserAuthenticated()) {
                            loadProfileAddress(data || []);
                        }
                    }
                })
                .catch(() => { });
        }

        return () => {
            isMounted.current = false;
        };
    }, [loadProfileAddress]);

    // Update city list when state changes
    useEffect(() => {
        if (watchedShippingState && stateList.length > 0) {
            const stateData = stateList.find(s => s.value === watchedShippingState);
            if (stateData) {
                setCityList(stateData.cities || []);
            }
        }
    }, [watchedShippingState, stateList]);

    return (
        <Modal size="lg" show={addressModalShow} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Shipping Address</Modal.Title>
                <button type="button" onClick={handleClose} className="closed btn">X</button>
            </Modal.Header>
            <Modal.Body>
                <Form autoComplete="off" onSubmit={handleSubmit(orderPlacesHandler)}>
                    <Modal.Body className="border-0 px-5">
                        <Row className="mb-4">
                            <Col xs="12">
                                <div className="delivery-info-box border rounded p-3 bg-light">
                                    <h6 className="font-weight-bold mb-3">Delivery Information:</h6>
                                    <ul className="mb-2">
                                        <li className="mb-2">A delivery charge of <strong>Rs. 20/ book</strong> to be paid, if you are <strong>buying</strong> the book.</li>
                                        <li className="mb-2">A delivery charge of <strong>Rs. 40/ book</strong> to be paid, if you are <strong>borrowing</strong> the book.</li>
                                    </ul>
                                    <p className="mb-0 small text-muted">
                                        <strong>Note:</strong> Book will be delivered at the security gate of your organization/ school.
                                    </p>
                                </div>
                            </Col>
                        </Row>

                        <input type="hidden" value="paid_delivery" {...register('shipping_order_type')} />

                        <Form.Group className="mb-4" controlId="shippingName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="off"
                                {...register('shipping_name', { required: 'Please enter your name.' })}
                                placeholder="Enter your name."
                            />
                            {errors?.shipping_name && (
                                <span className="text-danger small">{errors?.shipping_name?.message}</span>
                            )}
                        </Form.Group>

                        <Row>
                            <Col lg="6">
                                <Form.Group className="mb-4" controlId="shippingEmail">
                                    <Form.Label>Email ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoComplete="off"
                                        {...register('shipping_email', { required: 'Please enter your email.' })}
                                        placeholder="Enter your email."
                                    />
                                    {errors?.shipping_email && (
                                        <span className="text-danger small">{errors?.shipping_email?.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg="6">
                                <Form.Group className="mb-4" controlId="shippingPhone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoComplete="off"
                                        {...register('shipping_phone_no', { required: 'Please enter your phone.' })}
                                        placeholder="Enter your phone."
                                    />
                                    {errors?.shipping_phone_no && (
                                        <span className="text-danger small">{errors?.shipping_phone_no?.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4" controlId="shippingAddress">
                            <Form.Label>Organization/ School</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="off"
                                {...register('shipping_address', { required: 'Please enter your address.' })}
                                placeholder="Enter your address."
                            />
                            {errors?.shipping_address && (
                                <span className="text-danger small">{errors?.shipping_address?.message}</span>
                            )}
                        </Form.Group>

                        <Row>
                            <Col lg="4">
                                <Form.Group className="mb-4" controlId="shippingState">
                                    <Form.Label>State</Form.Label>
                                    <Form.Select
                                        className="form-control"
                                        {...register('shipping_state', { required: 'Please select state.' })}
                                    >
                                        <option value="">Select State</option>
                                        {stateList.map((state) => (
                                            <option key={state.value} value={state.value}>{state.label}</option>
                                        ))}
                                    </Form.Select>
                                    {errors?.shipping_state && (
                                        <span className="text-danger small">{errors?.shipping_state?.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg="4">
                                <Form.Group className="mb-4" controlId="shippingCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Select
                                        className="form-control"
                                        {...register('shipping_city', { required: 'Please select city.' })}
                                    >
                                        <option value="">Select City</option>
                                        {cityList.map((city) => (
                                            <option key={city.value} value={city.value}>{city.label}</option>
                                        ))}
                                    </Form.Select>
                                    {errors?.shipping_city && (
                                        <span className="text-danger small">{errors?.shipping_city?.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg="4">
                                <Form.Group className="mb-4" controlId="shippingPinCode">
                                    <Form.Label>Pin Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoComplete="off"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        {...register('shipping_pin_code', {
                                            maxLength: { value: 6, message: 'Enter a valid pin code' },
                                            pattern: { value: /^\d+$/, message: 'Invalid pin code.' }
                                        })}
                                        placeholder="Enter pin code (Optional)"
                                    />
                                    {errors?.shipping_pin_code && (
                                        <span className="text-danger small">{errors?.shipping_pin_code?.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer className="justify-content-center flex-column border-0 pt-0">
                        <Button className="px-4 mb-3" variant="primary" type="submit">
                            Place Your Order
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ManageAddress;
