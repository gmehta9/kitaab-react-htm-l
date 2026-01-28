import React, { createContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { axiosInstance } from '../axios/axios-config';
import Auth from '../auth/Auth';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
    const [cartData, setCartData] = useState([]);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [copyCartData, setCopyCartData] = useState([]);
    const [cartBtnClick, setCartBtnClick] = useState(0);

    // Stable reference for auth check
    const isAuthenticated = Auth.isUserAuthenticated();

    // Ref to track if component is mounted
    const isMounted = useRef(true);

    // Ref for debounce timer
    const debounceTimer = useRef(null);

    // Memoized get cart handler
    const getCartApiHandler = useCallback(() => {
        if (!Auth.isUserAuthenticated()) return;

        setIsCartLoading(true);
        axiosInstance.get('cart')
            .then((res) => {
                if (res && isMounted.current) {
                    const upList = res.data.map((itm) => ({
                        ...itm,
                        isReadyForOrder: true
                    }));
                    setCartData(upList);
                    setCopyCartData(res.data);
                    setIsCartLoading(false);
                }
            })
            .catch(() => {
                if (isMounted.current) {
                    setIsCartLoading(false);
                }
            });
    }, []);

    // Memoized cart update API handler
    const cartApiHandler = useCallback(() => {
        if (!Auth.isUserAuthenticated()) return;

        const cd = cartData.map(item => ({
            product_id: item.product_id || item.id,
            quantity: +item.quantity
        }));

        axiosInstance.post('cart', cd)
            .then((res) => {
                if (res && isMounted.current) {
                    getCartApiHandler();
                    setCopyCartData(cartData);
                }
            })
            .catch(() => {});
    }, [cartData, getCartApiHandler]);

    // Debounced cart update - using ref to avoid recreating
    const debouncedCartUpdate = useCallback(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            cartApiHandler();
        }, 1000);
    }, [cartApiHandler]);

    // Initial cart load - only on mount
    useEffect(() => {
        isMounted.current = true;

        if (Auth.isUserAuthenticated()) {
            getCartApiHandler();
        }

        return () => {
            isMounted.current = false;
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [getCartApiHandler]);

    // Cart update effect - only when cartBtnClick changes and > 0
    useEffect(() => {
        if (isAuthenticated && cartBtnClick > 0) {
            debouncedCartUpdate();
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [cartBtnClick, isAuthenticated, debouncedCartUpdate]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        cartData,
        setCartData,
        cartBtnClick,
        setCartBtnClick,
        copyCartData,
        setCopyCartData,
        isCartLoading,
        refreshCart: getCartApiHandler
    }), [cartData, cartBtnClick, copyCartData, isCartLoading, getCartApiHandler]);

    return (
        <MainContext.Provider value={contextValue}>
            {children}
        </MainContext.Provider>
    );
};

export default MainContext;
