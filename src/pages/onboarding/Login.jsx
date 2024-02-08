import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function Login({ loginModalShow, setLoginModalShow }) {

    return (
        <>
            <Modal backdrop="static" centered show={loginModalShow} onHide={() => setLoginModalShow(false)}>
                <Modal.Header className="position-relative justify-content-center">
                    <Modal.Title className="font-weight-bold">Login</Modal.Title>
                    <button
                        onClick={() => setLoginModalShow(false)}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete="false">
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
                        <Form.Group className="mb-4" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                autoComplete="false"
                                name="password"
                                type="password"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                    <Button
                        className=" mb-3"
                        variant="primary"
                        onClick={() => setLoginModalShow(false)}>
                        Sign In
                    </Button>
                    <Link to="">Create Account</Link>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Login;