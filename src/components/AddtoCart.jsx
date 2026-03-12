import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import MainContext, { getProductId } from "../context/Mcontext.context";
import toast from "react-hot-toast";
import Auth from "../auth/Auth";
import { openLoginModal } from "../redux/authModalSlice";
import { useDispatch } from "react-redux";

function AddToCartButton({ productDetail }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { setCartData, cartData, cartBtnClick, setCartBtnClick } = useContext(MainContext)

    const loggedUserId = Auth.loggedInUser()?.id;
    const productOwnerId = productDetail?.created_by_user?.id || productDetail?.user_id;
    const isOwnProduct = loggedUserId && productOwnerId && loggedUserId === productOwnerId;

    const cartItemHandler = (obj) => {
        if (!Auth.isUserAuthenticated()) {
            dispatch(openLoginModal())
            return
        }

        const objId = obj._id || obj.id;
        const existingItem = cartData.find(item => getProductId(item) === objId);

        if (!cartData || cartData.length === 0) {
            setCartData([{ ...obj, quantity: 1, isReadyForOrder: true }]);
            setCartBtnClick(cartBtnClick + 1)
            toast("Added to cart.", { duration: 2000, position: 'top-right' });
            return
        }
        if (existingItem) {
            toast('Book already in cart!')
        } else {
            toast("Added to cart.", {
                duration: 2000,
                position: 'top-right'
            });
            setCartData([...cartData, { ...obj, quantity: 1, isReadyForOrder: true }]);
            setCartBtnClick(cartBtnClick + 1)
        }
    }

    return (
        <Button
            type="button"
            onClick={() => {
                if (isOwnProduct) {
                    navigate('/product/edit', {
                        state: { pId: productDetail._id || productDetail.id }
                    })
                } else {
                    cartItemHandler(productDetail)
                }
            }}
            className={`mb-3 ${isOwnProduct ? 'edit-btn' : ''}`}
        >
            {isOwnProduct ? (
                <><i className="bi bi-pencil-square me-1" /> Edit</>
            ) : (
                <><i className="bi bi-cart-plus me-1" /> Add to Cart</>
            )}
        </Button>
    )
}

export default AddToCartButton;
