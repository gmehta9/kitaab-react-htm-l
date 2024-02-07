import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {

    return (
        <div className="footer-section py-5 w-100 text-center">
            <Image
                className="mr-2 "
                width={241}
                src="./assets/images/Kitaab-Junction-footer.png"
            />
            <Container>
                <Row className="mt-4">
                    <Col xs={12} className="d-flex justify-content-center">
                        <div className="d-flex mb-4">
                            <Link className="mx-3 text-white">
                                Home
                            </Link>
                            <Link className="mx-3 text-white">
                                About Us
                            </Link>
                            <Link className="mx-3 text-white">
                                Contact us
                            </Link>
                            <Link className="mx-3 text-white">
                                FAQ's
                            </Link>
                        </div>
                    </Col>
                    <Col xs={6} className="text-white text-left">
                        Copyright © 2023 Kitaab Junction
                    </Col>
                    <Col xs={6} className="d-flex justify-content-end">
                        <div className="d-flex ml-auto">
                            <span title="Twitter">
                                <Image
                                    className="mr-2"
                                    src="./assets/images/facebook.svg"
                                />
                            </span>
                            <span title="linkedin">
                                <Image
                                    className="mr-2"
                                    src="./assets/images/linkedin.svg"
                                />
                            </span>
                            <span title="insta">
                                <Image
                                    className="mr-2"
                                    src="./assets/images/instagram.svg"
                                />
                            </span>
                            <span title="twitter">
                                <Image
                                    className="mr-2"
                                    src="./assets/images/twitter.svg"
                                />
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;