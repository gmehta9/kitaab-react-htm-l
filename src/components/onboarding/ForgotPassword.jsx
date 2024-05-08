import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosInstance, headers } from "../../axios/axios-config";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../redux/authModalSlice";

function ForgotPassword({ forgotShowModal, setForgotShowModal, setIsContentLoading }) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' })
    const dispatch = useDispatch();
    const formSubmitHandler = (data) => {
        setIsContentLoading(true)
        axiosInstance.post("auth/pass-reset", data, {
            headers: headers,
        }).then((res) => {
            if (res) {
                setIsContentLoading(false)
                toast.success("Password successfully sent to email!");

            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    return (
        <>
            <Modal backdrop="static" centered show={forgotShowModal} onHide={() => setForgotShowModal(false)}>
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">Forgot Password</Modal.Title>
                    <button
                        onClick={() => {
                            reset()
                            setForgotShowModal(false)
                        }}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Form autoComplete="false" onSubmit={handleSubmit(formSubmitHandler)}>
                    <Modal.Body className="border-0 px-5">

                        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="false"
                                name="phoneEmailInput"
                                {...register('email', {
                                    required: 'Please enter your register email.'
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


                    </Modal.Body>
                    <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                        <Button
                            className="px-4 mb-3"
                            variant="primary"
                            type="submit"
                        >
                            Submit
                        </Button>
                        <div className="mb-4">
                            <Link onClick={() => {
                                setForgotShowModal(false)
                                dispatch(openLoginModal())
                            }}>Login</Link>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ForgotPassword;