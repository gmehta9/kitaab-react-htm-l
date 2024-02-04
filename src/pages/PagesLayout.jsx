import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
function PagesLayout() {

    return (
        <>
            <Header />
            <Container fluid>
                <Outlet />
            </Container>
        </>
    )
}

export default PagesLayout;