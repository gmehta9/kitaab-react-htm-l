import { Col, Image, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function ProductByID() {
    const location = useLocation()

    console.log('location', location);
    return (
        <>
            <Row>
                <Col xl={3}>
                    <Image src="" />

                </Col>
                <Col xl={9}>
                    kk

                </Col>
            </Row>
        </>
    )
}

export default ProductByID;