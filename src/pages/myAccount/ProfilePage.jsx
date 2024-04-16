import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Auth from "../../auth/Auth";
import { axiosInstance, headers } from "../../axios/axios-config";

function ProfilePage() {
    const { setIsContentLoading } = useOutletContext()
    const [stateList, setStateList] = useState();
    const userLogin = Auth.loggedInUser()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onChange' })

    const profileUpdateHandler = (data) => {

        setIsContentLoading(true)
        axiosInstance['post']('auth/profile', data, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                setIsContentLoading(false)
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
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    const getProfileUpdateHandler = () => {
        setIsContentLoading(true)
        axiosInstance.get(`auth/profile`, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((response) => {
            if (response) {
                // console.log(response);
                const user = response?.data
                setValue('name', user?.name)
                setValue('phone_number', user?.phone_number)
                setValue('email', user?.email)
                setValue('city', user?.city)
                setValue('state', user?.state)
                setValue('address', user?.address)
                setValue('pin_code', user?.pin_code)
            }
            setIsContentLoading(false)
        }).catch(() => {
            setIsContentLoading(false)
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
        getProfileUpdateHandler()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (userLogin) {
            setValue('name', userLogin?.name)
            setValue('phone_number', userLogin?.phone_number)
            setValue('email', userLogin?.email)
            setValue('city', userLogin?.city)
            setValue('state', userLogin?.state)
        }
    }, [setValue, userLogin])

    return (
        <>
            <Form autoComplete="false" onSubmit={handleSubmit(profileUpdateHandler)}>

                <Row>
                    <Col lg={12} className="pl-5">
                        <Row className="border-bottom pb-4 mb-4">
                            <Col lg={12} className="font-weight-bolder mb-3">
                                Personal Information
                            </Col>
                            <Col lg={5}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bxs-user' ></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        className="border-left-0"
                                        autoComplete="false"
                                        {...register('name', {
                                            required: true
                                        })}
                                        name="phoneEmailInput"
                                        placeholder="Enter your First Name"
                                    />
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row className="border-bottom pb-4 mb-4">
                            <Col lg={5}>
                                <Row >
                                    <Col lg={12} className="font-weight-bolder mb-3">
                                        Phone Number
                                    </Col>
                                    <Col lg={12}>
                                        <InputGroup>
                                            <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                                <i className='bx bx-mobile-alt'></i>
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                autoComplete="false"
                                                name="phoneInput"
                                                disabled={true}
                                                {...register('phone_number', {
                                                    required: true
                                                })}
                                                placeholder="Enter your phone"
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={5}>
                                <Row >
                                    <Col lg={12} className="font-weight-bolder mb-3">
                                        Email Address
                                    </Col>
                                    <Col lg={12}>
                                        <InputGroup>
                                            <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                                <i className='bx bx-envelope' ></i>
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                autoComplete="false"
                                                name="email"
                                                disabled={true}
                                                {...register('email', {
                                                    required: true
                                                })}
                                                placeholder="Enter your email"
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="border-bottom pb-4 mb-4">
                            <Col lg={12} className="font-weight-bolder mb-3">
                                Address
                            </Col>
                            <Col lg={12} className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bxs-edit-location'></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        autoComplete="false"
                                        {...register('address', {
                                            required: true
                                        })}
                                        placeholder="Enter your address"
                                    />
                                </InputGroup>
                            </Col>

                            <Col lg={4} className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bx-current-location' ></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        autoComplete="false"
                                        {...register('city', {
                                            required: true
                                        })}
                                        placeholder="Enter your city"
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bx-current-location' ></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        title="Enter state"
                                        autoComplete="false"
                                        {...register('state', {
                                            required: true
                                        })}
                                        placeholder="Enter your state"
                                    />
                                </InputGroup>

                            </Col>
                            <Col lg={4} className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bx-current-location'></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        title="Enter Pin Code"
                                        type="text"
                                        autoComplete="false"
                                        {...register('pin_code', {
                                            required: true
                                        })}
                                        placeholder="Enter your pin code"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>


                        <Row className="pb-4 mb-4">
                            <Col>
                                <Button type="submit">Submit</Button>
                            </Col>
                        </Row>

                    </Col>
                </Row >

            </Form >
        </>
    )
}

export default ProfilePage;