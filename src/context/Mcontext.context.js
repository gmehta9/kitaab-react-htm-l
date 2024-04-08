import React, { createContext, useEffect, useState } from 'react';
import { axiosInstance, headers } from '../axios/axios-config';
import Auth from '../auth/Auth';
import { debounce } from '../helper/Utils';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {

    const [cartData, setCartData] = useState([]);
    const [copyCartData, setCopyCartData] = useState([]);
    const [cartBtnClick, setCartBtnClick] = useState(0);

    const getCartApiHandlder = () => {

        cartData.map(item => ({ id: item.id, qty: item.qty }));

        axiosInstance['get']('cart', {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                console.log(res);
                setCopyCartData()
            }
        }).catch((error) => {
        });
    }

    const cartApiHandlder = () => {

        cartData.map(item => ({ id: item.id, qty: item.qty }));

        axiosInstance['post']('cart', cartData, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                console.log(res);
                setCopyCartData()
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

    useEffect(() => {
        if (Auth.isUserAuthenticated() && cartData.length > 0) {
            debounce((event) => {
                cartApiHandlder()
            }, 2000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartBtnClick])


    return (
        <MainContext.Provider
            value={{
                cartData,
                setCartData,
                cartBtnClick,
                setCartBtnClick,
                copyCartData,
                setCopyCartData
            }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainContext;
