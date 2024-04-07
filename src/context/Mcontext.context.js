import React, { createContext, useContext, useEffect, useState } from 'react';
import { axiosInstance, headers } from '../axios/axios-config';
import Auth from '../auth/Auth';
import { debounce } from '../helper/Utils';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {

    const [cartData, setCartData] = useState([]);
    const [cartBtnClick, setCartBtnClick] = useState(0);

    const cartApiHandlder = (method) => {

        cartData.map(item => ({ id: item.id, qty: item.qty }));

        axiosInstance[method]('cart', {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                console.log(res);
            }
        }).catch((error) => {
        });
    }

    useEffect(() => {

        if (Auth.isUserAuthenticated()) {
            cartApiHandlder('get')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (Auth.isUserAuthenticated() && cartData.length > 0) {
            debounce((event) => {

                cartApiHandlder()
            }, 2000)
        }
    }, [cartBtnClick])


    return (
        <MainContext.Provider
            value={{
                cartData,
                setCartData,
                cartBtnClick,
                setCartBtnClick
            }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainContext;
