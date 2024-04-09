import { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";

function ManageAddress({ setAddressModalShow, addressModalShow }) {

    const userLogin = Auth.loggedInUser()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onChange' })

    const handleClose = () => {
        setAddressModalShow(false)
    }

    const addressSubmitHandler = (data) => {
        axiosInstance['post']('auth/profile', data, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                if (data.address) {
                    const t = Auth.token()
                    const u = Auth.loggedInUser()

                    Auth.login({
                        user: {
                            ...u,
                            is_address: true
                        },
                        token: t
                    })
                }
                console.log(res);
            }
        }).catch((error) => {
        });
    }
    useEffect(() => {
        if (userLogin) {
            console.log(userLogin);
            setValue('name', userLogin?.name)
            setValue('phone_number', userLogin?.phone_number)
            setValue('email', userLogin?.email)
            setValue('city', userLogin?.city)
            setValue('state', userLogin?.state)
        }

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
                    <Modal.Title>Add Address</Modal.Title>
                    <button type="button" onClick={handleClose} className="closed btn">X</button>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete="false" onSubmit={handleSubmit(addressSubmitHandler)}>
                        <Modal.Body className="border-0 px-5">
                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    name="phoneEmail"
                                    {...register('name', {
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
                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    {...register('email', {
                                        required: 'Please enter your phone or email.'
                                    })}
                                    placeholder="Enter your phone or email."
                                    autoFocus
                                />
                                {errors?.email &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.email?.message}
                                    </span>
                                }
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    {...register('phone_no', {
                                        required: 'Please enter your phone or email.'
                                    })}
                                    placeholder="Enter your phone."
                                    autoFocus
                                />
                                {errors?.phone_no &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.phone_no?.message}
                                    </span>
                                }
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    {...register('address', {
                                        required: 'Please enter your address.'
                                    })}
                                    placeholder="Enter your address."
                                    autoFocus
                                />
                                {errors?.phoneEmail &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.phoneEmail?.message}
                                    </span>
                                }
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    {...register('city', {
                                        required: 'Please enter your city.'
                                    })}
                                    placeholder="Enter your city."
                                    autoFocus
                                />
                                {errors?.city &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.city?.message}
                                    </span>
                                }
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    {...register('state', {
                                        required: 'Please enter state.'
                                    })}
                                    placeholder="Enter your state."
                                    autoFocus
                                />
                                {errors?.state &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.state?.message}
                                    </span>
                                }
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                                <Form.Label>Pin Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    name="pin_code"
                                    {...register('pin_code', {
                                        required: 'Please enter your pin code.'
                                    })}
                                    placeholder="Enter your pin code."
                                    autoFocus
                                />
                                {errors?.pin_code &&
                                    <span className="text-danger small position-absolute">
                                        {errors?.pin_code?.message}
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

                        </Modal.Footer>
                    </Form>

                </Modal.Body>

            </Modal>
        </>
    )
}

export default ManageAddress;