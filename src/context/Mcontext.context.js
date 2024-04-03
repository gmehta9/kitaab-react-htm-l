import React, { createContext, useContext, useEffect, useState } from 'react';
import { axiosInstance, headers } from '../axios/axios-config';
import Auth from '../auth/Auth';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {

    const [cartData, setCartData] = useState([]);

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


    return (
        <MainContext.Provider
            value={{
                cartData,
                setCartData
            }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainContext;
