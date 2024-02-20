import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

function ProfilePage() {

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
                                        <i class='bx bxs-user' ></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        className="border-left-0"
                                        autoComplete="false"
                                        name="phoneEmailInput"
                                        placeholder="Enter your First Name"
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={5}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i class='bx bxs-user'></i>
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
                            <Col lg={12} className="font-weight-bolder mb-3">
                                Email Address
                            </Col>
                            <Col lg={5}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i class='bx bx-envelope' ></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        autoComplete="false"
                                        name="emailInput"
                                        placeholder="Enter your email"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>

                        <Row className="border-bottom pb-4 mb-4">
                            <Col lg={12} className="font-weight-bolder mb-3">
                                Phone Number
                            </Col>
                            <Col lg={5}>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                        <i class='bx bx-mobile-alt'></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        autoComplete="false"
                                        name="phoneInput"
                                        placeholder="Enter your phone"
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
                                        <i class='bx bx-lock' ></i>
                                        {/* <i class='bx bx-lock-open' ></i> */}
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
                                        <i class='bx bx-lock' ></i>
                                        {/*<i class='bx bx-lock-open' ></i> */}

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
                                        <i class='bx bx-lock' ></i>
                                        {/* <i class='bx bx-lock-open' ></i> */}

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
                </Row>

            </Form>
        </>
    )
}

export default ProfilePage;