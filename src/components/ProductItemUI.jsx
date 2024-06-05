

// import { useContext } from "react";
import { Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MEDIA_URL, replaceLogo } from "../helper/Utils";
// import MainContext from "../context/Mcontext.context";
import AddToCartButton from "./AddtoCart";

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

    return (
        <Col className={className}>
            <div className="book-card clickable position-relative" >
                {items?.is_approved === '0' &&
                    <span onClick={() => ClikedItem(items.id)} className="position-absolute approval-status">Pending For Approval</span>
                }

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
                    loading="lazy"
                    src={MEDIA_URL + 'product/' + items.image}
                    onClick={() => ClikedItem(items.id)}
                    className="thumbnail product-thumb rounded w-100" />
                <div className="book-info text-center mt-2 p-2" >
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
                        <AddToCartButton isEditAble={isEditAble} productDetail={items} />
                        {/* <Button
                            type="button"
                            onClick={() => {
                                if (isEditAble) {
                                    navigate('/product/edit', {
                                        state: {
                                            pId: items.id
                                        }
                                    })
                                } else {
                                    cartItemHandler(items)
                                }
                            }}
                            className="mb-3">
                            {!isEditAble ? "Add to Cart" : 'Edit'}
                        </Button> */}
                    </div>


                </div>
            </div>
        </Col>
    )
}

export default ProductItemUI;