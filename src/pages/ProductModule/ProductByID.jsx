import { Col, Image, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { srcPriFixLocal } from "../../helper/Helper";

function ProductByID() {
    const location = useLocation()

    console.log('location', location);
    return (
        <>
            <Row>
                <Col xl={4} md={4}>

                    <Image
                        className="w-100"
                        src={`${srcPriFixLocal}product-img/main-image.jpg`} />

                </Col>
                <Col xl={8} md={8}>

                    <div className="product">
                        <div className="product-heading">Azarinth Healer: Book Three - A LitRPG Adventure Kindle</div>
                        <div className="product-short-detail ">
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
                        </div>
                        <div className="product-short-rating">

                        </div>
                    </div>

                </Col>
            </Row>
        </>
    )
}

export default ProductByID;