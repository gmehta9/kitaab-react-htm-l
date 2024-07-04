import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import MainContext from "../context/Mcontext.context";
import toast from "react-hot-toast";
import Auth from "../auth/Auth";
import { openLoginModal } from "../redux/authModalSlice";
import { useDispatch } from "react-redux";

function AddToCartButton(props) {
    const { productDetail } = props
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { setCartData, cartData, cartBtnClick, setCartBtnClick } = useContext(MainContext)
    // const updateQuantity = (id, newQuantity) => {
    //     setCartData(prevCart => prevCart.map(item =>
    //         item.id === id ? { ...item, quantity: newQuantity } : item
    //     ));
    // };


    const cartItemHandler = (obj) => {

        if (!Auth.isUserAuthenticated()) {
            dispatch(openLoginModal())
            return
        }


        const existingItem = cartData.find(item => (+item?.product_id || item?.id) === (+obj?.product_id || obj?.id));

        if (!cartData && cartData.length === 0) {
            setCartData([{ ...obj, quantity: 1 }]);
            return
        }
        if (existingItem) {
            toast('Book already in cart!')
            // updateQuantity(existingItem.id, existingItem.quantity + 1);
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
                if (productDetail?.created_by_user?.id === Auth.loggedInUser()?.id) {
                    navigate('/product/edit', {
                        state: {
                            pId: productDetail.id
                        }
                    })
                } else {
                    cartItemHandler(productDetail)

                }
            }}
            className="mb-3">
            {productDetail?.created_by_user?.id !== Auth.loggedInUser()?.id ? "Add to Cart" : 'Edit'}
        </Button>
    )
}

export default AddToCartButton;