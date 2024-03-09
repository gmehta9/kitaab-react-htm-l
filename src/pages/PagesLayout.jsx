import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader";
import { useState } from "react";

function PagesLayout() {
    const [isContentLoading, setisContentLoading] = useState(false)
    return (
        <>
            <Header />
            {isContentLoading &&
                <Loader />
            }
            <Container fluid>
                <Outlet context={{ setisContentLoading }} />
            </Container>
        </>
    )
}

export default PagesLayout;