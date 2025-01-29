import { useEffect, useState } from "react";
import { Alert, Col, Image, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { axiosInstance } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import { MEDIA_URL, replaceLogo } from "../../helper/Utils";
import AddToCartButton from "../../components/AddtoCart";

function ProductByID() {

    const location = useLocation()

    const [productDetail, setProductDetail] = useState()
    const [contentLoading, setContentLoading] = useState()

    const [isEditAble, setIsEditAble] = useState(false)

    const getProductByIdHandler = (async (p) => {
        setContentLoading(true)

        let APIUrl = 'product/' + location?.state?.productId

        axiosInstance.get(`${APIUrl}`).then((response) => {
            if (response) {
                setProductDetail(response?.data)
                setContentLoading(false)

            }
        }).catch((error) => {
            setContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    useEffect(() => {
        if (productDetail?.created_by_user.id === Auth.loggedInUser()?.id) {
            setIsEditAble(true)
        }
        document.title = 'Book Detail | Kitaab Juction';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Auth.loggedInUser()?.id])

    useEffect(() => {
        getProductByIdHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.state?.productId])

    return (
        <>
            <div className="h2 mt-4 font-weight-bold">
                Book Detail
            </div>
            {contentLoading ?
                <Row className="my-5">
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
                    {productDetail?.is_approved === '0' &&
                        <Alert variant={'warning'}>
                            Booking approval is pending
                        </Alert>
                    }
                    <Row className="mt-5">
                        <Col xl={4} md={4}>

                            <Image
                                className="w-100"
                                onError={replaceLogo}
                                src={MEDIA_URL + 'product/' + productDetail?.image}
                            // MEDIA_URL + 'product/' +
                            // src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}product-img/main-image.jpg`} 
                            />

                        </Col>
                        <Col xl={8} md={8}>
                            <div className="">
                                Refrence ID :  {productDetail?.unique_id}
                            </div>
                            <div className="product">
                                <div className="product-heading text-capitalize">{productDetail?.title}</div>
                                <div className="product-short-detail" dangerouslySetInnerHTML={{ __html: productDetail?.short_description }}></div>
                                <div className="product-short-rating">

                                </div>

                                <div className="product-price font-weight-bold my-4">
                                    {productDetail?.transact_type === 'sell' ?
                                        <>
                                            {productDetail?.sale_price &&
                                                ` ₹ ${productDetail?.sale_price} `}
                                            {productDetail?.sale_price ?
                                                <span className="text-decoration-line-through">₹ {productDetail?.price}</span>
                                                :
                                                productDetail?.price
                                            }
                                        </>
                                        :
                                        'Sharing for 60 days'
                                    }
                                </div>

                                <div className="">
                                    <span className="font-weight-bold">Year of Publication:</span> {productDetail?.year_of_publication}
                                </div>

                                <div className="">
                                    <span className="font-weight-bold">Author:</span> <span className="text-capitalize">{productDetail?.auther}</span>
                                </div>

                                <div className="">
                                    <span className="font-weight-bold">Seller's City:</span> <span className="text-capitalize">{productDetail?.city}</span>
                                </div>


                                <div className="product-cart-btn my-4">
                                    <AddToCartButton isEditAble={isEditAble} productDetail={productDetail} />
                                    {/* <Button
                                        onClick={() => setCartData([11])}
                                        type="button"
                                        className="px-4">
                                        Add to Cart
                                    </Button> */}
                                </div>
                            </div>

                        </Col>
                    </Row >
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