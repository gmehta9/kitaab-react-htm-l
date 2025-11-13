import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { axiosInstance } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import { MEDIA_URL, replaceLogo } from "../../helper/Utils";
import AddToCartButton from "../../components/AddtoCart";
import '../../styles/product-detail.scss';

function ProductByID() {

    const location = useLocation()

    const [productDetail, setProductDetail] = useState()
    const [contentLoading, setContentLoading] = useState()

    const [isEditAble, setIsEditAble] = useState(false)

    const getProductByIdHandler = (async () => {
        setContentLoading(true)

        let APIUrl = 'product/' + location?.state?.productId

        axiosInstance.get(`${APIUrl}`).then((response) => {
            if (response) {
                setProductDetail(response?.data)
                setContentLoading(false)

            }
        }).catch(() => {
            setContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    useEffect(() => {
        if (productDetail?.created_by_user?.id === Auth.loggedInUser()?.id) {
            setIsEditAble(true)
        }
        document.title = 'Book Detail | Kitaab Juction';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Auth.loggedInUser()?.id])

    useEffect(() => {
        getProductByIdHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.state?.productId])

    const calculateDiscount = () => {
        if (productDetail?.sale_price && productDetail?.price) {
            const discount = ((productDetail.price - productDetail.sale_price) / productDetail.price * 100).toFixed(0);
            return discount;
        }
        return 0;
    };

    return (
        <div className="product-detail-container">
            <div className="product-detail-header">
                <h2>
                    <i className='bx bx-book-open'></i>
                    Book Details
                </h2>
            </div>

            {contentLoading ? (
                <Row className="my-5 product-detail-skeleton">
                    <Col xl={4} md={5}>
                        <div className="skeleton-image">
                            <Skeleton height="400px" />
                        </div>
                        <Skeleton height="40px" className="mt-3" count={2} />
                    </Col>
                    <Col xl={8} md={7}>
                        <div className="skeleton-info">
                            <Skeleton height="30px" width="150px" className="mb-3" />
                            <Skeleton height="50px" className="mb-3" />
                            <Skeleton height="20px" count={3} className="mb-4" />
                            <Skeleton height="80px" className="mb-4" />
                            <Skeleton height="60px" count={3} className="mb-4" />
                            <Skeleton height="50px" />
                        </div>
                    </Col>
                </Row>
            ) : (
                <>
                    {productDetail?.is_approved === '0' && (
                        <div className="approval-alert">
                            <div className="alert-icon">
                                <i className='bx bx-time-five'></i>
                            </div>
                            <div className="alert-content">
                                <div className="alert-title">Approval Pending</div>
                                <div className="alert-message">
                                    This book is currently under review and will be available once approved by our team.
                                </div>
                            </div>
                        </div>
                    )}

                    <Row className="mt-4">
                        <Col xl={4} md={5}>
                            <div className="product-detail-image-wrapper">
                                <div className="product-detail-image-container">
                                    <Image
                                        onError={replaceLogo}
                                        src={MEDIA_URL + 'product/' + productDetail?.image}
                                        alt={productDetail?.title}
                                    />
                                </div>
                                <div className="product-badges">
                                    {productDetail?.is_approved === '1' && (
                                        <span className="badge badge-status">
                                            <i className='bx bx-check-circle'></i>
                                            Verified
                                        </span>
                                    )}
                                    <span className="badge badge-type">
                                        <i className='bx bx-tag'></i>
                                        {productDetail?.transact_type === 'sell' ? 'For Sale' : 'For Sharing'}
                                    </span>
                                </div>
                            </div>
                        </Col>

                        <Col xl={8} md={7}>
                            <div className="product-detail-info">
                                <div className="product-reference">
                                    <i className='bx bx-barcode'></i>
                                    Reference ID: <span>{productDetail?.unique_id}</span>
                                </div>

                                <h1 className="product-title">{productDetail?.title}</h1>

                                {productDetail?.short_description && (
                                    <div
                                        className="product-short-description"
                                        dangerouslySetInnerHTML={{ __html: productDetail?.short_description }}
                                    />
                                )}

                                <div className="product-price-section">
                                    <div className="price-label">Price</div>
                                    {productDetail?.transact_type === 'sell' ? (
                                        <div className="price-value">
                                            <span className="price-current">
                                                ₹ {productDetail?.sale_price || productDetail?.price}
                                            </span>
                                            {productDetail?.sale_price && (
                                                <>
                                                    <span className="price-original">₹ {productDetail?.price}</span>
                                                    <span className="discount-badge">
                                                        {calculateDiscount()}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="sharing-info">
                                            <i className='bx bx-share-alt'></i>
                                            <span>Free Sharing for 60 Days</span>
                                        </div>
                                    )}
                                </div>

                                <div className="product-details-grid">
                                    {productDetail?.year_of_publication && (
                                        <div className="detail-item">
                                            <div className="detail-icon">
                                                <i className='bx bx-calendar'></i>
                                            </div>
                                            <div className="detail-content">
                                                <div className="detail-label">Publication Year</div>
                                                <div className="detail-value">{productDetail?.year_of_publication}</div>
                                            </div>
                                        </div>
                                    )}

                                    {productDetail?.auther && (
                                        <div className="detail-item">
                                            <div className="detail-icon">
                                                <i className='bx bx-user'></i>
                                            </div>
                                            <div className="detail-content">
                                                <div className="detail-label">Author</div>
                                                <div className="detail-value">{productDetail?.auther}</div>
                                            </div>
                                        </div>
                                    )}

                                    {productDetail?.city && (
                                        <div className="detail-item">
                                            <div className="detail-icon">
                                                <i className='bx bx-map'></i>
                                            </div>
                                            <div className="detail-content">
                                                <div className="detail-label">Seller's Location</div>
                                                <div className="detail-value">{productDetail?.city}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="product-actions">
                                    <AddToCartButton isEditAble={isEditAble} productDetail={productDetail} />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {productDetail?.description && (
                        <Row>
                            <Col xl={12} className="mt-4 mb-4">
                                <div className="product-description-section">
                                    <div className="section-header">
                                        <i className='bx bx-detail'></i>
                                        <h4>Detailed Description</h4>
                                    </div>
                                    <div
                                        className="description-content"
                                        dangerouslySetInnerHTML={{ __html: productDetail?.description }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </div>
    )
}

export default ProductByID;