import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

function Login({ loginModalShow, setLoginModalShow }) {
    const [signUpShowModal, setSignUpShowModal] = useState(false)
    const [forgotShowModal, setForgotShowModal] = useState(false)
    return (
        <>
            <Modal backdrop="static" centered show={loginModalShow} onHide={() => setLoginModalShow(false)}>
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">Login</Modal.Title>
                    <button
                        onClick={() => setLoginModalShow(false)}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Form autoComplete="false">
                    <Modal.Body className="border-0 px-5">
                        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email & Phone no</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="phoneEmailInput"
                                placeholder="Enter your phone or email"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                autoComplete="false"
                                name="password"
                                type="password"
                            />
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
                            type="button"
                            onClick={() => setLoginModalShow(false)}>
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
                forgotShowModal={forgotShowModal}
                setForgotShowModal={setForgotShowModal}
                setLoginModalShow={setLoginModalShow} />

            {/* SignUP Modal */}
            <SignUp
                signUpShowModal={signUpShowModal}
                setLoginModalShow={setLoginModalShow}
                setSignUpShowModal={setSignUpShowModal} />

        </>
    )
}

export default Login;