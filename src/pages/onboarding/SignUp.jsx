
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function SignUp({ setLoginModalShow, signUpShowModal, setSignUpShowModal }) {

    return (
        <>
            <Modal backdrop="static" centered show={signUpShowModal} onHide={() => setSignUpShowModal(false)}>
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">Create Account</Modal.Title>
                    <button
                        onClick={() => setSignUpShowModal(false)}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Modal.Body className="border-0 px-5">
                    <Form autoComplete="false">

                        <Form.Group className="mb-4" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="phoneEmailInput"
                                placeholder="Enter your Name"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="phoneno">
                            <Form.Label>Phone no</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="phoneEmailInput"
                                placeholder="Enter Your Phone"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="emailid">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="phoneEmailInput"
                                placeholder="Enter Your Email ID"
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
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                    <Button
                        className="px-4 mb-3"
                        variant="primary"
                        onClick={() => setSignUpShowModal(false)}>
                        Submit
                    </Button>
                    <div className="mb-4">
                        <Link type="button" onClick={() => {
                            setLoginModalShow(true)
                            setSignUpShowModal(false)
                        }} >Login</Link>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SignUp;