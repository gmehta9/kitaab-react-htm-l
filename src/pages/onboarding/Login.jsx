import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import Auth from "../../auth/Auth";
import { axiosInstance } from "../../axios/axios-config";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";


function Login({ loginModalShow, setLoginModalShow, setIsUserLoggedIn, setIsContentLoading }) {
    const [signUpShowModal, setSignUpShowModal] = useState(false);
    const [forgotShowModal, setForgotShowModal] = useState(false);

    // const [userType, setUserType] = useState('')

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' })

    const formSubmitHandler = (data) => {
        setIsContentLoading(true)
        axiosInstance.post("auth/sign-in", { ...data, type: 'Buyer/Seller' }).then((res) => {
            if (res) {
                toast.success("Login Successfully!");
                setIsContentLoading(false)
                Auth.login({ user: res.user, token: res.token }, true)
                setIsUserLoggedIn(true)
                setLoginModalShow(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    useEffect(() => {

    }, [reset])
    return (
        <>
            <Modal backdrop="static" centered show={loginModalShow} >
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">Login</Modal.Title>
                    <button
                        onClick={() => {
                            reset()
                            setLoginModalShow(false)
                        }}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Form autoComplete="false" onSubmit={handleSubmit(formSubmitHandler)}>
                    <Modal.Body className="border-0 px-5">
                        {/* <Row className="mb-3 border-bottom">
                            <Col className="text-center">
                                <div className="radio-ui">
                                    <input
                                        type="radio"
                                        id="buyerUser"
                                        checked={userType === 'buyerUser'}
                                        onClick={() => setUserType('buyerUser')}
                                        name="userType"
                                        className="d-none" />
                                    <label htmlFor="buyerUser" className="radio-label">Buyer</label>
                                </div>
                            </Col>
                            <Col className="text-center">
                                <div className="radio-ui">
                                    <input
                                        type="radio"
                                        id="sellerUser"
                                        name="userType"
                                        checked={userType === 'sellerUser'}
                                        onClick={() => setUserType('sellerUser')}
                                        className="d-none" />
                                    <label htmlFor="sellerUser" className="radio-label">Seller</label>
                                </div>
                            </Col>

                        </Row> */}
                        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email & Phone no</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="phoneEmail"
                                {...register('phoneEmail', {
                                    required: 'Please enter your phone or email.'
                                })}
                                placeholder="Enter your phone or email."
                                autoFocus
                            />
                            {errors?.phoneEmail &&
                                <span className="text-danger small position-absolute">
                                    {errors?.phoneEmail?.message}
                                </span>
                            }
                        </Form.Group>
                        <Form.Group className="mb-2" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('password', {
                                    required: 'Please enter your password.'
                                })}
                                name="password"
                                placeholder="Enter your password."
                                type="password"
                            />
                            {errors?.password &&
                                <span className="text-danger small position-absolute">
                                    {errors?.password?.message}
                                </span>
                            }
                        </Form.Group>
                        <div className="text-right">
                            <Link
                                onClick={() => {
                                    setLoginModalShow(false)
                                    setForgotShowModal(true)
                                }}>Forgot Password?</Link>
                        </div>
                    </Modal.Body>

                    <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                        <Button
                            className="px-4 mb-3"
                            variant="primary"
                            type="submit"
                        >
                            Sign In
                        </Button>
                        <div className="mb-4">
                            Not Registered? <Link onClick={() => {
                                setSignUpShowModal(true)
                                setLoginModalShow(false)
                            }}>Create Account</Link>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Forgort Modal */}
            <ForgotPassword
                setIsContentLoading={setIsContentLoading}
                forgotShowModal={forgotShowModal}
                setForgotShowModal={setForgotShowModal}
                setLoginModalShow={setLoginModalShow} />

            {/* SignUP Modal */}
            <SignUp
                setIsContentLoading={setIsContentLoading}
                signUpShowModal={signUpShowModal}
                setLoginModalShow={setLoginModalShow}
                setSignUpShowModal={setSignUpShowModal} />

        </>
    )
}

export default Login;