import { Button, Card, Col, Image, Row } from "react-bootstrap";
import { useLocation, useOutletContext } from "react-router-dom";
import { srcPriFixLocal } from "../../helper/Helper";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import { useEffect, useState } from "react";
import { MEDIA_URL, replaceLogo } from "../../helper/Utils";

function ProductByID() {

    const location = useLocation()

    const [productDetail, setProductDetail] = useState()
    const [contentLoading, setContentLoading] = useState()

    const getProductByIdHandler = (async (p) => {
        setContentLoading(true)

        let APIUrl = 'product/' + location?.state?.productId

        axiosInstance.get(`${APIUrl}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            },
        }).then((response) => {
            if (response) {
                console.log('response?.data?.data', response?.data);
                setProductDetail(response?.data)
                setContentLoading(false)

            }
        }).catch((error) => {
            setContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    useEffect(() => {
        getProductByIdHandler()
    }, [location?.state?.productId])
    return (
        <>
            <div className="h2 mt-4 font-weight-bold">
                Book Detail
            </div>
            {contentLoading ?
                <Row className="mt-5">
                    <Col xl={4} md={4}>
                        <Skeleton height="300px" />
                    </Col>
                    <Col xl={8} md={8}>
                        <Skeleton count={4} />
                        <br />
                        <br />
                        <Skeleton count={4} />
                    </Col>
                </Row>
                :
                <>
                    <Row className="mt-5">
                        <Col xl={4} md={4}>

                            <Image
                                className="w-100"
                                onError={replaceLogo}
                                src={MEDIA_URL + 'product/' + productDetail?.image}
                            // MEDIA_URL + 'product/' +
                            // src={`${srcPriFixLocal}product-img/main-image.jpg`} 
                            />

                        </Col>
                        <Col xl={8} md={8}>

                            <div className="product">
                                <div className="product-heading">{productDetail?.title}</div>
                                <div className="product-short-detail" dangerouslySetInnerHTML={{ __html: productDetail?.short_description }}></div>
                                <div className="product-short-rating">

                                </div>
                                <div className="product-price font-weight-bold my-4">
                                    ₹ {productDetail?.price} <span className="text-decoration-line-through">₹ {productDetail?.sale_price}</span>
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
                            <div dangerouslySetInnerHTML={{ __html: productDetail?.description }}></div>
                        </Col>
                    </Row>
                </>
            }

        </>
    )
}

export default ProductByID;