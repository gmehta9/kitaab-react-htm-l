import React, { createContext, useEffect, useState } from 'react';
import { axiosInstance, headers } from '../axios/axios-config';
import Auth from '../auth/Auth';
// import { debounce } from '../helper/Utils';
import { debounce } from 'lodash'

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {

    const [cartData, setCartData] = useState([]);
    const [copyCartData, setCopyCartData] = useState([]);
    const [cartBtnClick, setCartBtnClick] = useState(0);

    const getCartApiHandlder = () => {
        axiosInstance['get']('cart', {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                console.log(res);
                setCartData(res.data)
                setCopyCartData(res.data)
            }
        }).catch((error) => {
        });
    }

    const cartApiHandlder = () => {

        const cd = cartData.map(item => ({ product_id: item.id, quantity: item.quantity }));

        axiosInstance.post('cart', cd, {
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
    const dd = debounce((event) => {
        cartApiHandlder()
    }, 2000)
    useEffect(() => {
        if (Auth.isUserAuthenticated() && cartData.length > 0) {
            dd()
            return () => {
                dd.cancel();
            };
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
