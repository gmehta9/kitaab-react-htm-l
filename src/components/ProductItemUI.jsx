

import { Button, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { srcPriFixLocal } from "../helper/Helper";
import { MEDIA_URL, replaceLogo } from "../helper/Utils";

function ProductItemUI({ items, className, isEditAble }) {
    const navigate = useNavigate()

    const ClikedItem = (items_id) => {
        navigate('/product/product-detail', {
            state: {
                productId: items_id
            }
        })
    }
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
                    onClick={() => ClikedItem(items.id)}
                    className="thumbnail product-thumb rounded w-100" />
                <div className="book-info text-center mt-2" >
                    <div className="author-name" onClick={() => ClikedItem(items.id)} >
                        {items.auther}
                    </div>
                    <div className="book-name" onClick={() => ClikedItem(items.id)}>
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
                            onClick={() => {
                                if (isEditAble) {
                                    navigate('/product/edit', {
                                        state: {
                                            pId: items.id
                                        }
                                    })
                                }
                            }}
                            className="mb-3">
                            {!isEditAble ? "Add to Cart" : 'Edit'}
                        </Button>
                    </div>


                </div>
            </div>
        </Col>
    )
}

export default ProductItemUI;