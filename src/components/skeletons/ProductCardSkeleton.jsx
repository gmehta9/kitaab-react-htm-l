import { Col } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ProductCardSkeleton({ cards = 12, className }) {
    return (
        <>
            {Array(cards).fill(0).map((_, index) => (
                <Col key={index} className={className}>
                    <div className="book-card">
                        <Skeleton height={280} className="rounded mb-2" />
                        <div className="book-info text-center mt-2 p-2">
                            <Skeleton width="60%" height={15} className="mx-auto mb-2" />
                            <Skeleton width="80%" height={18} className="mx-auto mb-2" />
                            <Skeleton width="40%" height={20} className="mx-auto mb-3" />
                            <Skeleton height={38} className="rounded" />
                        </div>
                    </div>
                </Col>
            ))}
        </>
    );
}

export default ProductCardSkeleton;
