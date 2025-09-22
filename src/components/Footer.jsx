import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {

    return (
        <div className="footer-section py-3 w-100 text-center mt-auto">
            <Image
                className="mr-2 "
                width={241}
                src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}Kitaab-Junction-footer.png`}
            />
            <Container>
                <Row className="mt-4">
                    <Col xs={12} className="d-flex justify-content-center">
                        <div className="d-flex mb-4">
                            <Link className="mx-3 text-white">
                                Home
                            </Link>
                            <Link to={'/about-us'} className="mx-3 text-white">
                                About Us
                            </Link>
                            <Link to={'/contact-us'} className="mx-3 text-white">
                                Contact us
                            </Link>
                            <Link to={'/faq'} className="mx-3 text-white">
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
                                <a href="https://www.facebook.com/mykitaabjunction" target="_blank" rel="noreferrer">
                                    <Image
                                        className="mr-2"
                                        width={'20'}
                                        src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}facebook.svg`}
                                    />
                                </a>
                            </span>
                            <span title="linkedin">
                                <a href="https://www.linkedin.com/in/kitaab-junction-5913622b6?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B%2FsACibXvQKuYhsyH%2BXNeAg%3D%3D" target="_blank" rel="noreferrer">
                                    <Image
                                        className="mr-2"
                                        width={'20'}
                                        src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}linkedin.svg`}
                                    />
                                </a>
                            </span>
                            <span title="insta">
                                <a href="https://www.instagram.com/junctionkitaab/" target="_blank" rel="noreferrer">
                                    <Image
                                        className="mr-2"
                                        width={'20'}
                                        src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}instagram.svg`}
                                    />
                                </a>
                            </span>
                            <span title="twitter">
                                <a href="https://twitter.com/KitaabJ" target="_blank" rel="noreferrer">
                                    <Image
                                        className="mr-2"
                                        width={'20'}
                                        src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}twitter.svg`}
                                    />
                                </a>
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;