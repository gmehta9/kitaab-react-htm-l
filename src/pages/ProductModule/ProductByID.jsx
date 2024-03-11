import { Button, Col, Image, Row } from "react-bootstrap";
import { useLocation, useOutletContext } from "react-router-dom";
import { srcPriFixLocal } from "../../helper/Helper";
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import { useState } from "react";

function ProductByID() {

    const location = useLocation()

    const { setIsContentLoading } = useOutletContext()

    const [productDetail, setProductDetail] = useState()

    const getProductByIdHandler = (async (p) => {
        setIsContentLoading(true)
        const params = {
            page: p,
            size: 50,
        };
        let APIUrl = 'category'

        axiosInstance.get(`${APIUrl}?${new URLSearchParams(params)}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            },
        }).then((response) => {
            if (response) {
                console.log('response?.data?.data', response);
                setProductDetail(response?.data?.data)
                setIsContentLoading(false)

            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });


    return (
        <>
            <Row className="mt-5">
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
                        <div className="product-price font-weight-bold my-4">
                            $210 <span className="text-decoration-line-through">$250</span>
                        </div>
                        <div className="product-cart-btn my-4">
                            <Button type="button" className="px-4">Add to Cart</Button>
                        </div>
                    </div>

                </Col>
            </Row>
            <Row>
                <Col xl={12} className="mt-4 mb-4">
                    <div className="h4 font-weight-bold">Description</div>
                    <p> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero.
                    </p>
                </Col>
            </Row>
        </>
    )
}

export default ProductByID;