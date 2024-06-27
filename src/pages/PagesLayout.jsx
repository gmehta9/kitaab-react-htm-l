import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader";
import { useState } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";
import Footer from "../components/Footer";

function PagesLayout() {

    const [isContentLoading, setIsContentLoading] = useState(false)
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    return (
        <>
            <Provider store={store}>

                <Header
                    isContentLoading={isContentLoading}
                    setIsContentLoading={setIsContentLoading}
                    isUserLoggedIn={isUserLoggedIn}
                    setIsUserLoggedIn={setIsUserLoggedIn}
                />
                {isContentLoading &&
                    <Loader />
                }
                <Container fluid >
                    <Outlet context={{
                        isContentLoading,
                        setIsContentLoading,
                    }} />
                </Container>
                <Footer />
            </Provider>
        </>
    )
}

export default PagesLayout;