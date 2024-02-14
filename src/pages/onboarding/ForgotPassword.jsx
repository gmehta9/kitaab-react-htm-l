import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function ForgotPassword({ forgotShowModal, setForgotShowModal, setLoginModalShow }) {

    return (
        <>
            <Modal backdrop="static" centered show={forgotShowModal} onHide={() => setForgotShowModal(false)}>
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">Frogot Password</Modal.Title>
                    <button
                        onClick={() => setForgotShowModal(false)}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Modal.Body className="border-0 px-5">
                    <Form autoComplete="false">
                        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="phoneEmailInput"
                                placeholder="Enter Your Email ID"
                                autoFocus
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                    <Button
                        className="px-4 mb-3"
                        variant="primary"
                    >
                        Submit
                    </Button>
                    <div className="mb-4">
                        <Link onClick={() => {
                            setForgotShowModal(false)
                            setLoginModalShow(true)
                        }}>Login</Link>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ForgotPassword;