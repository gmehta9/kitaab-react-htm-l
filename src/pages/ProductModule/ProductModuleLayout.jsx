import { Button, Container, Form, Image, InputGroup, Row } from "react-bootstrap";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Footer from "../../components/Footer";
import { srcPriFixLocal } from "../../helper/Helper";

function ProductModuleLayout() {
    const location = useLocation()

    const { setIsContentLoading } = useOutletContext()

    return (
        <div className="inner-pages row border-top ">
            {(location.pathname !== '/product/add' && location.pathname !== '/product/product-detail') &&
                <Container fluid className="border-bottom mb-3">

                    <Container>
                        <Row className=" justify-content-center">
                            <InputGroup className="mb-0 bg-white p-2 rounded">
                                <Form.Control
                                    className="border-0 bg-light rounded"
                                    placeholder="Search Books..."
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                />
                                <Button id="basic-addon2" className="ml-2 align-items-center d-flex">
                                    <Image
                                        src={`${srcPriFixLocal}search-icon-white.svg`}
                                    />
                                </Button>
                                {/* <DropdownButton
                                align={'end'}
                                onSelect={(event) => console.log(event)}
                                bsPrefix="bg-transparent border border-1 ml-2 rounded px-3"
                                variant="" title="For Selling">
                                <Dropdown.Item eventKey={'selling'}>For Selling</Dropdown.Item>
                                <Dropdown.Item eventKey={'buying'}>For Buying</Dropdown.Item>

                            </DropdownButton> */}
                            </InputGroup>
                        </Row>
                    </Container>

                </Container>
            }


            <Container>
                <Outlet context={{ setIsContentLoading }} />
            </Container>


            <Footer />
        </div>
    )
}

export default ProductModuleLayout;