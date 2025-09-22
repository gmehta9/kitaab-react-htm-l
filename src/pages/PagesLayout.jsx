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
                <div className="d-flex flex-column min-vh-100">
                    <Header
                        isContentLoading={isContentLoading}
                        setIsContentLoading={setIsContentLoading}
                        isUserLoggedIn={isUserLoggedIn}
                        setIsUserLoggedIn={setIsUserLoggedIn}
                    />
                    {isContentLoading &&
                        <Loader />
                    }
                    <Container fluid className="flex-grow-1">
                        <Outlet context={{
                            isContentLoading,
                            setIsContentLoading,
                        }} />
                    </Container>
                    <Footer />
                </div>
            </Provider>
        </>
    )
}

export default PagesLayout;