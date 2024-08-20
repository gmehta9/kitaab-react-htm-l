import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Auth from "../../auth/Auth";
import { axiosInstance } from "../../axios/axios-config";
import toast from "react-hot-toast";

function ProfilePage() {
    const { setIsContentLoading } = useOutletContext()
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm({ mode: 'onChange' })

    const profileUpdateHandler = (data) => {

        setIsContentLoading(true)
        axiosInstance['post']('auth/profile', data).then((res) => {
            if (res) {
                setIsContentLoading(false)
                const t = Auth.token()
                const u = Auth.loggedInUser()
                toast.success('Profile updated successfully.')
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

    const getProfileUpdateHandler = (sl) => {
        setIsContentLoading(true)
        axiosInstance.get(`auth/profile`).then((response) => {
            if (response) {
                const user = response?.data;

                sl.forEach(element => {
                    if (element.value === user?.state) {
                        setCityList(element.cities)
                    }
                });

                setValue('name', user?.name)
                setValue('phone_number', user?.phone_number)
                setValue('email', user?.email)
                setValue('city', user?.city.toLowerCase())
                setValue('state', user?.state.toLowerCase())
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
            getProfileUpdateHandler(myJson)
        })

        document.title = 'My Profile | Kitaab Juction';

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (watch('state')) {
            stateList.forEach(element => {
                if (element.value === watch('state')) {
                    setCityList(element.cities)
                }
            });

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateList, watch('state')]);

    // useEffect(() => {
    //     if (userLogin) {
    //         setValue('name', userLogin?.name)
    //         setValue('phone_number', userLogin?.phone_number)
    //         setValue('email', userLogin?.email)
    //         setValue('city', userLogin?.city)
    //         setValue('state', userLogin?.state)
    //     }
    // }, [setValue, userLogin])

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
                                    <Form.Select
                                        className="form-control"
                                        value={watch('state')}
                                        {...register('state', {
                                            required: true
                                        })}
                                    >
                                        <option value=''>Select State</option>
                                        {stateList.map((state, index) =>
                                            <option key={index + 'st'} value={state.value}>{state.label}</option>
                                        )}
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                            <Col lg={4} className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bx-current-location' ></i>
                                    </InputGroup.Text>

                                    <Form.Select
                                        className="form-control"
                                        value={watch('city')}
                                        {...register('city', {
                                            required: true
                                        })}
                                    >

                                        <option value=''>Select City</option>
                                        {cityList && cityList.map((city, index) =>
                                            <option key={index + 'cty'} value={city?.value}>{city?.label}</option>
                                        )}
                                    </Form.Select>

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