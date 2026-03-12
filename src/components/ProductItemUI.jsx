import { Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MEDIA_URL, replaceLogo } from "../helper/Utils";
import AddToCartButton from "./AddtoCart";
import Auth from "../auth/Auth";
import '../styles/product-card.scss';

function ProductItemUI({ items, className }) {
    const navigate = useNavigate()

    const loggedUserId = Auth.loggedInUser()?.id;
    const productOwnerId = items?.created_by_user?.id;
    const isOwnProduct = loggedUserId && productOwnerId && loggedUserId === productOwnerId;

    const itemId = items?._id || items?.id;

    const ClikedItem = (items_id) => {
        navigate('/product/product-detail', {
            state: {
                productId: items_id
            }
        })
    }

    const truncatedTitle = items?.title
        ? (items.title.length > 50 ? items.title.slice(0, 50) + '...' : items.title)
        : '';

    return (
        <Col className={className}>
            <div className="book-card clickable" >
                <div className="product-thumb-container">
                    {items?.is_approved === '0' &&
                        <div onClick={() => ClikedItem(itemId)} className="approval-status">
                            Pending For Approval
                        </div>
                    }

                    {isOwnProduct &&
                        <span className="own-product-badge">
                            <i className="bi bi-person-check" /> Your Listing
                        </span>
                    }

                    <Image
                        onError={replaceLogo}
                        loading="lazy"
                        src={MEDIA_URL + 'product/' + items.image}
                        onClick={() => ClikedItem(itemId)}
                        className="product-thumb"
                        alt={truncatedTitle}
                    />
                </div>

                <div className="book-info" >
                    <div className="author-name" onClick={() => ClikedItem(itemId)} >
                        {items.auther}
                    </div>
                    <div className="book-name" onClick={() => ClikedItem(itemId)}>
                        {truncatedTitle}
                    </div>

                    {items?.transact_type === 'sell' ? (
                        <div className="book-price">
                            {items.sale_price ? (
                                <>
                                    ₹ {items.sale_price}/-
                                    <del>₹ {items.price}/-</del>
                                </>
                            ) : (
                                `₹ ${items.price}/-`
                            )}
                        </div>
                    ) : (
                        <div className="sharing-info">Sharing for 60 days</div>
                    )}

                    <div className="action-btn">
                        <AddToCartButton productDetail={items} />
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default ProductItemUI;
