import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ProfilePage() {

    const [stateList, setStateList] = useState();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' })

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
    }, [])

    return (
        <>
            <Form autoComplete="false">

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
                            <Col lg={5}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bxs-user'></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        autoComplete="false"
                                        name="phoneEmailInput"
                                        placeholder="Enter your Last Name"
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

                        <Row className="border-bottom pb-4 mb-4">
                            <Col lg={12} className="font-weight-bolder mb-3">
                                Password
                            </Col>
                            <Col lg={4}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bx-lock' ></i>
                                        {/* <i className='bx bx-lock-open' ></i> */}
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        autoComplete="false"
                                        name="currentPassword"
                                        placeholder="Current Password"
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={4}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bx-lock' ></i>
                                        {/*<i className='bx bx-lock-open' ></i> */}

                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        autoComplete="false"
                                        name="newPassword"
                                        placeholder="New Password"
                                        autoFocus
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={4}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i className='bx bx-lock' ></i>
                                        {/* <i className='bx bx-lock-open' ></i> */}

                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        autoComplete="false"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        autoFocus
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