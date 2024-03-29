

import { useContext } from "react";
import { Button, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MEDIA_URL, replaceLogo } from "../helper/Utils";
import MainContext from "../context/Mcontext.context";

function ProductItemUI({ items, className, isEditAble }) {
    const navigate = useNavigate()
    const { setCartData } = useContext(MainContext)
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
                    <div className="book-price">
                        {items?.transact_type === 'sell' ?
                            <>
                                {items.sale_price && ` ₹ ${items.sale_price}/-`}

                                <div className="book-price">

                                    {items.sale_price ?
                                        <del className="text-dark">₹ {items.price}/-</del>
                                        :
                                        `₹ ${items.price}/-`
                                    }

                                </div>
                            </>
                            :
                            <div className="mb-4" >Sharing for 60 days</div>
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
                                } else {
                                    setCartData([items])

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