import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader";
import { useState, useContext } from "react";

function PagesLayout() {
    const [isContentLoading, setIsContentLoading] = useState(false)


    return (
        <>
            <Header
                isContentLoading={isContentLoading}
                setIsContentLoading={setIsContentLoading}
            />
            {isContentLoading &&
                <Loader />
            }
            <Container fluid>
                <Outlet context={{ isContentLoading, setIsContentLoading }} />
            </Container>

        </>
    )
}

export default PagesLayout;