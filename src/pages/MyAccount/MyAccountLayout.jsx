import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";

function MyAccountLayout() {

    return (
        <div className="inner-pages row border-top ">
            <Container>

                <Outlet />

            </Container>
            <Footer />
        </div>
    )
}

export default MyAccountLayout;