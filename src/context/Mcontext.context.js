import React, { createContext, useEffect, useState } from 'react';
import { axiosInstance, headers } from '../axios/axios-config';
import Auth from '../auth/Auth';
// import { debounce } from '../helper/Utils';
import { debounce } from 'lodash'

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {

    const [cartData, setCartData] = useState([]);
    const [isCartLoading, setIsCartLoading] = useState(false)
    const [copyCartData, setCopyCartData] = useState([]);
    const [cartBtnClick, setCartBtnClick] = useState(0);

    const getCartApiHandlder = () => {
        setIsCartLoading(true)
        axiosInstance['get']('cart', {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                console.log(res);
                setIsCartLoading(false)
                const upList = res.data.map((itm) => {
                    itm.isReadyForOrder = true
                    return itm
                })
                setCartData(upList)
                setCopyCartData(res.data)
            }
        }).catch((error) => {
            setIsCartLoading(false)
        });
    }

    const cartApiHandlder = () => {

        const cd = cartData.map(item => ({ product_id: (item.product_id || item.id), quantity: +item.quantity }));

        axiosInstance.post('cart', cd, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                getCartApiHandlder()
                setCopyCartData(cartData)
            }
        }).catch((error) => {
        });
    }

    useEffect(() => {
        if (Auth.isUserAuthenticated()) {
            getCartApiHandlder()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const cartUpdateHandler = debounce((event) => {
        cartApiHandlder()
    }, 1000)

    useEffect(() => {
        if (Auth.isUserAuthenticated() && cartBtnClick > 0) {
            cartUpdateHandler()
            return () => {
                cartUpdateHandler.cancel();
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartBtnClick, Auth.isUserAuthenticated()])

    return (
        <MainContext.Provider
            value={{
                cartData,
                setCartData,
                cartBtnClick,
                setCartBtnClick,
                copyCartData,
                setCopyCartData,
                isCartLoading
            }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainContext;