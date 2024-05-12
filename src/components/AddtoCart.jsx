import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import MainContext from "../context/Mcontext.context";
import toast from "react-hot-toast";
import Auth from "../auth/Auth";

function AddToCartButton(props) {
    const { isEditAble, productDetail } = props
    // const loggedUser = Auth.isUserAuthenticated()

    const navigate = useNavigate()
    const { setCartData, cartData, cartBtnClick, setCartBtnClick } = useContext(MainContext)
    // const updateQuantity = (id, newQuantity) => {
    //     setCartData(prevCart => prevCart.map(item =>
    //         item.id === id ? { ...item, quantity: newQuantity } : item
    //     ));
    // };


    const cartItemHandler = (obj) => {
        const existingItem = cartData.find(item => (+item?.product_id || item?.id) === (+obj?.product_id || obj?.id));

        if (!cartData && cartData.length === 0) {
            setCartData([{ ...obj, quantity: 1 }]);
            return
        }
        if (existingItem) {
            toast('Book already in cart!')
            // updateQuantity(existingItem.id, existingItem.quantity + 1);
        } else {
            setCartData([...cartData, { ...obj, quantity: 1 }]);
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
                    setCartBtnClick(cartBtnClick + 1)
                }
            }}
            className="mb-3">
            {productDetail?.created_by_user?.id !== Auth.loggedInUser()?.id ? "Add to Cart" : 'Edit'}
        </Button>
    )
}

export default AddToCartButton;