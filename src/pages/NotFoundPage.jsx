import { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = '404 - Page Not Found | Kitaab Junction';
    }, []);

    return (
        <Container>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', textAlign: 'center' }}>
                <h1 style={{ fontSize: '120px', fontWeight: 'bold', color: '#007445', marginBottom: '20px' }}>404</h1>
                <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Page Not Found</h2>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px', maxWidth: '500px' }}>
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="d-flex gap-3">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/')}
                        style={{ minWidth: '150px' }}>
                        Go to Home
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="lg"
                        onClick={() => navigate(-1)}
                        style={{ minWidth: '150px' }}>
                        Go Back
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export default NotFoundPage;
