import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ManageAddress({ setAddressModalShow, addressModalShow, setCartData, setCartBtnClick, cartData, setIsContentLoading }) {
    const navigate = useNavigate()
    const userLogin = Auth.loggedInUser()
    const { register, handleSubmit, setValue, watch, getValues, reset, formState: { errors } } = useForm({ mode: 'onChange' })
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const handleClose = () => {
        setAddressModalShow(false)
    }

    const orderPlacesHandler = (data) => {

        const order = cartData.filter(cd => cd.isReadyForOrder).map(item => item.id);

        if (!order || order?.length === 0) {
            toast.error("No order Selected in cart!", {
                duration: 2000
            });
            return
        }
        setIsContentLoading(true)
        axiosInstance['post']('order', {
            ...data,
            shipping_price: getValues('shipping_order_type') === 'self_pickup' ? '20' : '40',
            'cart_ids': order,

        }, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((res) => {
            if (res) {
                toast.success("Order Placed successfully, Please check your email.", {
                    duration: 5000
                });
                setCartBtnClick(1 + 9)
                setCartData([])
                handleClose()
                setIsContentLoading(false)
                navigate('/account/order-history')
            }
        }).catch((error) => {
            setIsContentLoading(false)
        })
    }

    const ProfileAddressHandler = (sl) => {
        axiosInstance.get(`auth/profile`, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((response) => {
            if (response) {

                const user = response?.data
                sl.forEach(element => {
                    if (element.value === user?.state) {
                        setCityList(element.cities)
                    }
                });
                setValue('shipping_name', user?.name)
                setValue('shipping_phone_no', user?.phone_number)
                setValue('shipping_email', user?.email)
                setValue('shipping_city', user?.city)
                setValue('shipping_state', user?.state)
                setValue('shipping_address', user?.address)
                setValue('shipping_pin_code', user?.pin_code)
            }
        }).catch((error) => {
        });
    }

    useEffect(() => {
        fetch('cityState.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            setStateList(myJson)
            ProfileAddressHandler(myJson)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (watch('shipping_state')) {
            stateList.forEach(element => {
                if (element.value === watch('shipping_state')) {
                    setCityList(element.cities)
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateList, watch('shipping_state')]);

    useEffect(() => {

        if (userLogin) {
            ProfileAddressHandler()
        }

        register('phone_number')
        register('email')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {/* <div className="d-flex justify-content-between"> */}
            {/* <h3>Manage Address</h3> */}
            {/* <Button onClick={() => setModalShow(true)} variant="info">Add Address</Button> */}
            {/* </div> */}

            <Modal size="lg" show={addressModalShow} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Shipping Address</Modal.Title>
                    <button type="button" onClick={handleClose} className="closed btn">X</button>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete="false" onSubmit={handleSubmit(orderPlacesHandler)}>
                        <Modal.Body className="border-0 px-5">

                            <Row>
                                <Col xs="6">
                                    <div className="order-type text-center">
                                        <input
                                            id="self"
                                            className="d-none"
                                            type="radio"
                                            name="shipping_order_type"
                                            value={'self_pickup'}
                                            {...register('shipping_order_type', {
                                                required: 'Field required.'
                                            })} />
                                        <label
                                            htmlFor="self"
                                            className={`rounded-3 text-left border w-75 link  ${errors?.shipping_order_type && 'border-danger'}`}>
                                            Self Pickup
                                        </label>
                                    </div>
                                </Col>
                                <Col xs="6">
                                    <div className="order-type text-center">
                                        <input
                                            id="paid"
                                            className="d-none"
                                            type="radio"
                                            name="shipping_order_type"
                                            value={'paid_delivery'}
                                            {...register('shipping_order_type', {
                                                required: 'Field required.'
                                            })} />
                                        <label
                                            htmlFor="paid"
                                            className={`rounded-3 text-left border w-75 ${errors?.shipping_order_type && 'border-danger'}`}>
                                            Paid Delivery <span className="small">(only in Delhi-NCR)</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col xs="12" className="position-relative pb-3">
                                    {errors?.shipping_order_type &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.shipping_order_type?.message}
                                        </span>
                                    }</Col>
                            </Row>

                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    name="phoneEmail"
                                    {...register('shipping_name', {
                                        required: 'Please enter your phone or email.'
                                    })}
                                    placeholder="Enter your phone or email."
                                    autoFocus
                                />
                                {errors?.shipping_name &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.shipping_name?.message}
                                    </span>
                                }
                            </Form.Group>

                            <Row>
                                <Col lg="6">
                                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Email ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            autoComplete="false"
                                            {...register('shipping_email', {
                                                required: 'Please enter your phone or email.'
                                            })}
                                            placeholder="Enter your phone or email."
                                            autoFocus
                                        />
                                        {errors?.shipping_email &&
                                            <span className="text-danger small position-absolute">
                                                {errors?.shipping_email?.message}
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            autoComplete="false"
                                            {...register('shipping_phone_no', {
                                                required: 'Please enter your phone or email.'
                                            })}
                                            placeholder="Enter your phone."
                                            autoFocus
                                        />
                                        {errors?.shipping_phone_no &&
                                            <span className="text-danger small position-absolute">
                                                {errors?.shipping_phone_no?.message}
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    {...register('shipping_address', {
                                        required: 'Please enter your address.'
                                    })}
                                    placeholder="Enter your address."
                                    autoFocus
                                />
                                {errors?.shipping_address &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.shipping_address?.message}
                                    </span>
                                }
                            </Form.Group>
                            <Row>
                                <Col lg="4">
                                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                        <Form.Label>State</Form.Label>

                                        <Form.Select
                                            className="form-control"
                                            value={watch('shipping_state')}
                                            {...register('shipping_state', {
                                                required: 'Please select state.'
                                            })}
                                        >
                                            <option value=''>Select State</option>
                                            {stateList.map((state, index) =>
                                                <option key={index + 'st'} value={state.value}>{state.label}</option>
                                            )}
                                        </Form.Select>
                                        {errors?.shipping_state &&
                                            <span className="text-danger small position-absolute">
                                                {errors?.shipping_state?.message}
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                        <Form.Label>City</Form.Label>

                                        <Form.Select
                                            className="form-control"
                                            value={watch('shipping_city')}
                                            {...register('shipping_city', {
                                                required: 'Please select city.'
                                            })}
                                        >
                                            <option value=''>Select City</option>
                                            {cityList && cityList.map((city, index) =>
                                                <option key={index + 'cty'} value={city?.value}>{city?.label}</option>
                                            )}
                                        </Form.Select>
                                        {errors?.shipping_city &&
                                            <span className="text-danger small position-absolute">
                                                {errors?.shipping_city?.message}
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>


                                <Col lg="4">
                                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Pin Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            autoComplete="false"
                                            name="pin_code"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            {...register('shipping_pin_code', {
                                                required: 'Please enter your pin code.',
                                                maxLength: {
                                                    value: 6,
                                                    message: 'Enter a valid pin code'
                                                },
                                                pattern: {
                                                    value: /^\d+$/,
                                                    message: 'Invalid pin code.'
                                                }
                                            })}
                                            placeholder="Enter your pin code."
                                            autoFocus
                                        />
                                        {errors?.shipping_pin_code &&
                                            <span className="text-danger small position-absolute">
                                                {errors?.shipping_pin_code?.message}
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>



                        </Modal.Body>

                        <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                            <Button
                                className="px-4 mb-3"
                                variant="primary"
                                type="submit"
                            >
                                Place Your Order
                            </Button>

                        </Modal.Footer>
                    </Form>

                </Modal.Body>

            </Modal>
        </>
    )
}

export default ManageAddress;