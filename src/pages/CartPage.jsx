import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Header from "../components/Header";

import { useContext, useState } from "react";
import Footer from "../components/Footer";
import MainContext from "../context/Mcontext.context";


function CartPage() {

    const [isContentLoading, setIsContentLoading] = useState(false)
    const { cartData, setCartData } = useContext(MainContext)

    return (
        <>
            <Header
                isContentLoading={isContentLoading}
                setIsContentLoading={setIsContentLoading}
            />


            <div className="inner-pages row border-top ">
                <Container className="my-5">

                    <Row>

                        <Col lg={12}>
                            <div className="h2 font-weight-bold">
                                Cart
                            </div>
                        </Col>

                        <Col lg={12}>
                            <Table striped bordered >

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Book Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cartData?.length === 0 &&
                                        <tr>
                                            <td colSpan={4} className="text-center">Cart is Empty</td>
                                        </tr>
                                    }

                                    {cartData?.map((catData, index) =>
                                        <tr key={index + 'catdata'}>
                                            <td>{index + 1}</td>
                                            <td>{catData?.title}</td>
                                            <td>
                                                <input
                                                    style={{ width: '70px' }}
                                                    type="number"
                                                    max={catData?.transact_type === 'sell' && 1}
                                                    min="0"
                                                    value={catData.qty || 1}
                                                    name="qty"
                                                />
                                            </td>
                                            <td>
                                                {catData?.transact_type === 'sell' ?
                                                    catData?.sale_price || catData?.price
                                                    : 'Sharing for 60 days'
                                                }

                                            </td>
                                            <td></td>
                                        </tr>
                                    )

                                    }

                                </tbody>
                            </Table>
                        </Col>

                        <Col lg={12} className="text-right mt-4">

                            <Button
                                disabled={cartData?.length === 0}
                                className="ml-auto"
                                variant="dark">Proceed</Button>

                        </Col>

                    </Row>

                </Container>

                <Footer />
            </div>
        </>
    )
}

export default CartPage;