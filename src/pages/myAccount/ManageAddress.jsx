import { useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ManageAddress({ setAddressModalShow, addressModalShow, cartData }) {
    const navigate = useNavigate()
    const userLogin = Auth.loggedInUser()
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onChange' })

    const handleClose = () => {
        setAddressModalShow(false)
    }

    const orderPlacesHandler = (data) => {

        // const order = cartData.map(item => ({ product_id: item.id, quantity: item.quantity }));
        const order = cartData.map(item => item.id);
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
                handleClose()
                navigate('/account/order-history')

            }
        }).catch((error) => {
            // setIsContentLoading(false)
        })
    }

    const ProfileAddressHandler = () => {
        axiosInstance.get(`auth/profile`, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((response) => {
            if (response) {

                const user = response?.data
                setValue('shipping_name', user?.name)
                setValue('shipping_phone_no', user?.phone_number)
                setValue('shipping_email', user?.email)
                setValue('shipping_city', user?.city)
                setValue('shipping_state', user?.state)
                setValue('shipping_address', user?.address)
            }
        }).catch((error) => {
        });
    }

    // const addressSubmitHandler = (data) => {
    //     axiosInstance['post']('auth/profile', data, {
    //         headers: {
    //             ...headers,
    //             Authorization: `Bearer ${Auth.token()}`,
    //         }
    //     }).then((res) => {
    //         if (res) {
    //             if (data.address) {
    //                 const t = Auth.token()
    //                 const u = Auth.loggedInUser()

    //                 Auth.login({
    //                     user: {
    //                         ...u,
    //                         is_address: true
    //                     },
    //                     token: t
    //                 })
    //                 handleClose()
    //                 toast.success("Address updated successfully!");
    //             }
    //         }
    //     }).catch((error) => {
    //     });
    // }
    useEffect(() => {
        // if (userLogin) {
        //     console.log(userLogin);
        //     setValue('name', userLogin?.name)
        //     setValue('phone_number', userLogin?.phone_number)
        //     setValue('email', userLogin?.email)
        //     setValue('city', userLogin?.city)
        //     setValue('state', userLogin?.state)
        // }
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
                                            name="order_type"
                                            value={'self_pickup'}
                                            {...register('shipping_order_type', {
                                                required: 'Please enter your phone or email.'
                                            })} />
                                        <label htmlFor="self" className="rounded-3 border w-75 p-3 link">
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
                                            name="order_type"
                                            value={'paid_delivery'}
                                            {...register('shipping_order_type', {
                                                required: 'Please enter your phone or email.'
                                            })} />
                                        <label htmlFor="paid" className="rounded-3 border w-75 p-3">
                                            Paid Delivery
                                        </label>
                                    </div>
                                </Col>
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
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            autoComplete="false"
                                            {...register('shipping_city', {
                                                required: 'Please enter your city.'
                                            })}
                                            placeholder="Enter your city."
                                            autoFocus
                                        />
                                        {errors?.shipping_city &&
                                            <span className="text-danger small position-absolute">
                                                {errors?.shipping_city?.message}
                                            </span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            autoComplete="false"
                                            {...register('shipping_state', {
                                                required: 'Please enter state.'
                                            })}
                                            placeholder="Enter your state."
                                            autoFocus
                                        />
                                        {errors?.shipping_state &&
                                            <span className="text-danger small position-absolute">
                                                {errors?.shipping_state?.message}
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