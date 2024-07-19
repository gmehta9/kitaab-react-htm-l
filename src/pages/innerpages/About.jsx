import { useEffect } from "react";
import { Container } from "react-bootstrap";

function AboutPage() {
    useEffect(() => {
        document.title = 'About us | Kitaab Juction';
    }, []);
    return (
        <Container>
            <div className="mt-5">
                <h3>About Us</h3>
                <p>
                    KitaabJunction is an initiative to make our mother earth a better place to live. In this direction we have taken a small but potentially giant step. This is a place where we can share our used books as we move forward in our life. This sharing of books will not only help us in reducing the carbon footprint by protecting precious trees being cut down but also help you in cherishing the life journey of your book. Most importantly it will help us in serving millions of people who can’t afford many books at market price.
                    Soon we will bring public libraries in your city at your doorstep...
                </p>
                <p>
                    Looking forward to turn our nation smart with smarter people through an exciting collaboration with you guys...
                </p>
            </div>
        </Container>
    )
}

export default AboutPage;