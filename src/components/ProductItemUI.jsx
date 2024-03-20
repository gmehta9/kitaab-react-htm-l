

import { Button, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { srcPriFixLocal } from "../helper/Helper";
import { MEDIA_URL, replaceLogo } from "../helper/Utils";

function ProductItemUI({ items, className }) {
    const navigate = useNavigate()
    return (
        <Col className={className}>
            <div className="book-card clickable position-relative" >

                {/* Cart Button */}
                {/* <Button
                    type="button"
                    className="product-icon left position-absolute d-flex">
                    <Image className="w-100 align-self-center" src={`${srcPriFixLocal}shopping-cart-icon.svg`} />
                </Button> */}

                {/* Book Share Button */}
                {/* <Button
                    type="button"
                    className="product-icon right position-absolute d-flex">
                    <Image className="w-100 align-self-center" src={`${srcPriFixLocal}share-product.svg`} />
                </Button> */}
                <Image
                    onError={replaceLogo}
                    src={MEDIA_URL + 'product/' + items.image}
                    onClick={() => navigate('/product/product-detail', {
                        state: {
                            productId: items.id
                        }
                    })}
                    className="thumbnail product-thumb rounded w-100" />
                <div className="book-info text-center mt-2"
                    onClick={() => navigate('/product/product-detail', {
                        state: {
                            productId: items.id
                        }
                    })}>
                    <div className="author-name">
                        {items.auther}
                    </div>
                    <div className="book-name">
                        {items.title}
                    </div>
                    {items.sale_price &&
                        <div className="book-price">
                            ₹ {items.sale_price}/-
                        </div>
                    }
                    <div className="book-price">
                        {items.sale_price ?
                            <del>₹ {items.price}/-</del>
                            :
                            `₹ ${items.price}/-`
                        }

                    </div>
                    <div className="action-btn">
                        <Button
                            type="button"
                            className="mb-3">
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default ProductItemUI;