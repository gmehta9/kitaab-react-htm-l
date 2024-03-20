
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axios/axios-config";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import Select from 'react-select'


function SignUp({ setLoginModalShow, signUpShowModal, setSignUpShowModal, setIsContentLoading }) {
    const [stateList, setStateList] = useState()
    const [cityList, setCityList] = useState()
    const [city, setCity] = useState()
    const [state, setState] = useState()
    const selectInputRef = useRef()
    const { register, handleSubmit, reset, resetField, setValue, formState: { errors } } = useForm({ mode: 'onChange' })

    const formSubmitHandler = (data) => {

        console.log(data);

        axiosInstance.post("auth/sign-up", data, {
            // headers: headers,
        }).then((res) => {
            if (res) {
                toast.success("SignUp Successfully!");
                setSignUpShowModal(false)
                setLoginModalShow(true)
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
        })
        register('state', { required: 'Please select state.' })
        register('city', { required: 'Please select city.' })
    }, [])


    // useEffect(() => {
    //     if (state?.value && city?.value) {
    //         setCity(null)
    //         // selectInputRef.current.clearValue()
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [state])



    return (
        <>
            <Modal backdrop="static" centered show={signUpShowModal} onHide={() => setSignUpShowModal(false)}>
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">Create Account</Modal.Title>

                    <button
                        onClick={() => {
                            reset()
                            setSignUpShowModal(false)
                        }}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>

                </Modal.Header>
                <Form autoComplete="false" onSubmit={handleSubmit(formSubmitHandler)}>
                    <Modal.Body className="border-0 px-5">

                        {/* <Row className="mb-3">
                            <Col className="text-center">
                                <div className="radio-ui">
                                    <input type="radio" id="buyerUser" name="userType" className="d-none" />
                                    <label htmlFor="buyerUser" className="radio-label">Buyer</label>
                                </div>
                            </Col>
                            <Col className="text-center">
                                <div className="radio-ui">
                                    <input type="radio" id="sellerUser" name="userType" className="d-none" />
                                    <label htmlFor="sellerUser" className="radio-label">Seller</label>
                                </div>
                            </Col>
                        </Row> */}
                        <Form.Group className="mb-4" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="name"
                                {...register('name', {
                                    required: 'Please enter name.'
                                })}
                                placeholder="Enter your Name"
                                autoFocus
                            />

                            {errors?.name &&
                                <span className="text-danger small position-absolute">
                                    {errors?.name?.message}
                                </span>
                            }
                        </Form.Group>

                        <Row>
                            <Col lg="6">
                                <Form.Group className="mb-4" controlId="emailid">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoComplete="false"
                                        name="email"
                                        {...register('email', {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                                message: "Enter valid email",
                                            }
                                        })}
                                        placeholder="Enter Your Email ID"
                                        autoFocus
                                    />
                                    {errors?.email &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.email?.message}
                                        </span>
                                    }
                                </Form.Group>
                            </Col>
                            <Col lg="6">
                                <Form.Group className="mb-4" controlId="phone_number">
                                    <Form.Label>Phone no</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoComplete="false"
                                        name="phone_number"
                                        {...register('phone_number', {
                                            required: "Phone no is required.",
                                            minLength: {
                                                value: 10,
                                                message: "The Phone no. must be 10 digits.",
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: "The Phone no. must be 10 digits.",
                                            },
                                            pattern: {
                                                // value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                                                value: /^[0-9]{10}$/,
                                                message: "The Phone no. must be 10 digits.",
                                            },
                                        })}
                                        placeholder="Enter Your Phone"
                                        autoFocus
                                    />
                                    {errors?.phone_number &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.phone_number?.message}
                                        </span>
                                    }
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                autoComplete="false"
                                name="password"
                                // isValid={!errors?.password}
                                {...register('password', {
                                    required: 'Please enter password.',
                                    minLength: {
                                        value: 8,
                                        message: 'Password length must be 8 characters.'
                                    }
                                })}
                                type="password"
                            />
                            {errors?.password &&
                                <span className="text-danger small position-absolute">
                                    {errors?.password?.message}
                                </span>
                            }
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="organization">
                            <Form.Label>Organization</Form.Label>
                            <Form.Control
                                autoComplete="false"
                                name="organization"
                                {...register('organization', {
                                    required: 'Please enter organization.'
                                })}
                                type="text"
                            />
                            {errors?.organization &&
                                <span className="text-danger small position-absolute">
                                    {errors?.organization?.message}
                                </span>
                            }
                        </Form.Group>
                        {/* {stateList} */}
                        <Row>
                            <Col lg="6">
                                <Form.Group className="mb-4" controlId="state">
                                    <Form.Label>State</Form.Label>
                                    <Select
                                        options={stateList}
                                        value={state}
                                        onChange={(e) => {
                                            setState(e)
                                            setValue('state', e.value)
                                            setCity(null)
                                            resetField('city')
                                            setCityList(e.cities)
                                        }}
                                    />
                                    {errors?.state &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.state?.message}
                                        </span>
                                    }
                                </Form.Group>
                            </Col>
                            <Col lg="6">
                                <Form.Group className="mb-4" controlId="city">
                                    <Form.Label>City</Form.Label>

                                    <Select
                                        options={cityList}
                                        ref={selectInputRef}
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e)
                                            setValue('city', e.value)
                                        }}
                                    />
                                    {errors?.city &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.city?.message}
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
                        // onClick={() => setSignUpShowModal(false)}
                        >
                            Submit
                        </Button>
                        <div className="mb-4">
                            <Link type="button" onClick={() => {
                                setLoginModalShow(true)
                                setSignUpShowModal(false)
                            }} >Login</Link>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default SignUp;