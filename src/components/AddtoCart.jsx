import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import MainContext from "../context/Mcontext.context";

function AddToCartButton(props) {
    const { isEditAble, productDetail } = props

    const navigate = useNavigate()
    const { setCartData, cartData, cartBtnClick, setCartBtnClick } = useContext(MainContext)
    const updateQuantity = (id, newQuantity) => {
        setCartData(prevCart => prevCart.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const cartItemHandler = (items) => {
        console.log('items,', items);
        const existingItem = cartData.find(item => item.id === items.id);
        console.log('existingItem', existingItem);

        if (!cartData && cartData.length === 0) {
            setCartData([{ ...items, quantity: 1 }]);
            return
        }
        if (existingItem) {
            updateQuantity(existingItem.id, existingItem.quantity + 1);
        } else {
            setCartData([...cartData, { ...items, quantity: 1 }]);
        }

    }


    return (
        <Button
            type="button"
            onClick={() => {
                if (isEditAble) {
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
            {!isEditAble ? "Add to Cart" : 'Edit'}
        </Button>
    )
}

export default AddToCartButton;