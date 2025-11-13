import { Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MEDIA_URL, replaceLogo } from "../helper/Utils";
import AddToCartButton from "./AddtoCart";
import '../styles/product-card.scss';

function ProductItemUI({ items, className, isEditAble }) {
    const navigate = useNavigate()
    // const { setCartData, cartData } = useContext(MainContext)
    const ClikedItem = (items_id) => {
        navigate('/product/product-detail', {
            state: {
                productId: items_id
            }
        })
    }
    // const updateQuantity = (id, newQuantity) => {
    //     setCartData(prevCart => prevCart.map(item =>
    //         item.id === id ? { ...item, quantity: newQuantity } : item
    //     ));
    // };

    // const cartItemHandler = (items) => {
    //     console.log('items,', items);
    //     const existingItem = cartData.find(item => item.id === items.id);
    //     console.log('existingItem', existingItem);

    //     if (!cartData && cartData.length === 0) {
    //         setCartData([{ ...items, quantity: 1 }]);
    //         return
    //     }
    //     if (existingItem) {
    //         updateQuantity(existingItem.id, existingItem.quantity + 1);
    //     } else {
    //         setCartData([...cartData, { ...items, quantity: 1 }]);
    //     }

    // }

    const truncatedTitle = items?.title
        ? (items.title.length > 50 ? items.title.slice(0, 50) + '...' : items.title)
        : '';

    return (
        <Col className={className}>
            <div className="book-card clickable" >
                <div className="product-thumb-container">
                    {items?.is_approved === '0' &&
                        <div onClick={() => ClikedItem(items.id)} className="approval-status">
                            Pending For Approval
                        </div>
                    }

                    <Image
                        onError={replaceLogo}
                        loading="lazy"
                        src={MEDIA_URL + 'product/' + items.image}
                        onClick={() => ClikedItem(items.id)}
                        className="product-thumb"
                        alt={truncatedTitle}
                    />
                </div>

                <div className="book-info" >
                    <div className="author-name" onClick={() => ClikedItem(items.id)} >
                        {items.auther}
                    </div>
                    <div className="book-name" onClick={() => ClikedItem(items.id)}>
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
                        <AddToCartButton isEditAble={isEditAble} productDetail={items} />
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default ProductItemUI;