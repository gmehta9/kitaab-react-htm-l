import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Auth from "../../auth/Auth";
import { axiosInstance, headers } from "../../axios/axios-config";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";


function ChangePassword({ changePasswordShow, setChangePasswordShow }) {

    const [isContentLoading, setIsContentLoading] = useState('')

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ mode: 'onChange' })

    const changePasswordFormSubmitHandler = (data) => {
        setIsContentLoading(true)
        axiosInstance.post("auth/pass-change", data, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((res) => {
            if (res) {
                toast.success("Password update Successfully!");
                setIsContentLoading(false)
                // Auth.login({ user: res.user, token: res.token }, true)
                setChangePasswordShow(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    // useEffect(() => {

    // }, [reset])
    return (
        <>
            <Modal backdrop="static" centered show={changePasswordShow} >
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">Change Password</Modal.Title>
                    <button
                        onClick={() => {
                            reset()
                            setChangePasswordShow(false)
                        }}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Form autoComplete="false" onSubmit={handleSubmit(changePasswordFormSubmitHandler)}>
                    <Modal.Body className="border-0 px-5">
                        <Form.Group className="mb-4" controlId="old_password">
                            <Form.Label>Old Password<sup className="text-danger small">*</sup></Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('old_password', {
                                    required: 'Please enter your old password.',
                                    maxLength: {
                                        value: 8,
                                        message: 'Password length must 8 charachter.'
                                    }
                                })}
                                placeholder="Enter your old password."
                                type="password"
                            />
                            {errors?.password &&
                                <span className="text-danger small position-absolute">
                                    {errors?.password?.message}
                                </span>
                            }
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="new_password">
                            <Form.Label>New Password<sup className="text-danger small">*</sup></Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('new_password', {
                                    required: 'Please enter your new password.',
                                    maxLength: {
                                        value: 8,
                                        message: 'Password length must be 8 charachter.'
                                    }
                                })}
                                placeholder="Enter your new password."
                                type="password"
                            />
                            {errors?.new_password &&
                                <span className="text-danger small position-absolute">
                                    {errors?.new_password?.message}
                                </span>
                            }
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="password_confirmation">
                            <Form.Label>Confrim Password<sup className="text-danger small">*</sup></Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('password_confirmation', {
                                    required: 'Field is required.',
                                    validate: (val) => {
                                        if (watch("new_password") !== val) {
                                            return "The new and confirmation password does not match.";
                                        }
                                    },
                                })}
                                placeholder="Enter your password confirmation."
                                type="password"
                            />
                            {errors?.password_confirmation &&
                                <span className="text-danger small position-absolute">
                                    {errors?.password_confirmation?.message}
                                </span>
                            }
                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                        <Button
                            className="px-4 mb-3"
                            variant="primary"
                            type="submit"
                            disabled={isContentLoading}
                        >
                            Submit
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ChangePassword;