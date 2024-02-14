

import { Button, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { srcPriFixLocal } from "../helper/Helper";

function ProductItemUI({ items, className }) {
    const navigate = useNavigate()
    return (
        <Col className={className}>
            <div className="book-card clickable position-relative" >
                <Button
                    type="button"
                    className="product-icon left position-absolute d-flex">
                    <Image className="w-100 align-self-center" src={`${srcPriFixLocal}shopping-cart-icon.svg`} />
                </Button>
                <Button
                    type="button"
                    className="product-icon right position-absolute d-flex">
                    <Image className="w-100 align-self-center" src={`${srcPriFixLocal}share-product.svg`} />
                </Button>
                <Image
                    src={items.cpver_image}
                    onClick={() => navigate('/product/product-detail', {
                        state: {
                            productId: items.id
                        }
                    })}
                    className="thumbnail rounded w-100" />
                <div className="book-info text-center mt-2"
                    onClick={() => navigate('/product/product-detail', {
                        state: {
                            productId: items.id
                        }
                    })}>
                    <div className="author-name">
                        {items.author}
                    </div>
                    <div className="book-name">
                        {items.title}
                    </div>
                    <div className="book-price">
                        ₹ {items.price}/-
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default ProductItemUI;