import React, { createContext, useState } from 'react';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {

    const [cartData, setCartData] = useState([]);

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
