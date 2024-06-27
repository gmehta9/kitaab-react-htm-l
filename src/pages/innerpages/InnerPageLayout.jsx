import { Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";


function InnerPageLayout() {

    return (
        <Row>
            <Container style={{ minHeight: '30rem' }} className="inner-pages row border-top mx-auto">
                <Outlet />
            </Container>
            {/* <Footer /> */}
        </Row>
    )
}

export default InnerPageLayout;