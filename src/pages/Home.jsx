import { Button, Col, Container, Image, Row } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const books = [
    {
        id: 1,
        title: 'Vintage Grazie',
        author: 'Markrem Hoddel',
        cpver_image: './assets/images/book-1.jpg',
        price: '10'
    },
    {
        id: 2,
        title: 'Vintage Grazie',
        author: 'Markrem Hoddel',
        cpver_image: './assets/images/book-2.jpg',
        price: '99'
    },
    {
        id: 3,
        title: 'Vintage Grazie',
        author: 'Markrem Hoddel',
        cpver_image: './assets/images/book-3.jpg',
        price: '199'
    },
    {
        id: 4,
        title: 'Vintage Grazie',
        author: 'Markrem Hoddel',
        cpver_image: './assets/images/book-4.jpg',
        price: '349'
    },
    {
        id: 5,
        title: 'Vintage Grazie',
        author: 'Markrem Hoddel',
        cpver_image: './assets/images/book-5.jpg',
        price: '250'
    }
]

const CategoriesList = ["All", "School", "Professional Courses", "Regular Courses", "Fiction", "Non - Fiction", "Competitive Exams", "Others"]

function HomePage() {

    return (
        <>
            <Row className="banner-row justify-content-center align-items-center">
                <Col lg={6} className="text-center">
                    <span className="h3 find-book-heading ">Find the books that you are looking for</span>
                    <InputGroup className="mb-3 mt-3 bg-white p-2 rounded">
                        <Form.Control
                            className="border-0 rounded"
                            placeholder="Search Books..."
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                        />
                        <Button id="basic-addon2" className="ml-2 px-4 align-items-center d-flex">
                            <Image
                                className="mr-2"
                                src="./assets/images/search-icon-white.svg"
                            />
                            Find Book
                        </Button>
                    </InputGroup>

                </Col>
            </Row>

            <Container className="my-5">
                <div className="heading h3 text-center mb-4">
                    Book By <span>Categories</span>
                </div>
                <div className="">
                    <div className="p-0 d-flex justify-content-center my-4">
                        {CategoriesList.map((cl, index) =>
                            <button type="button" className="btn mx-2 border-0 bg-transparent px-0 mx-3" key={index + 'cl'}>{cl}</button>
                        )}
                    </div>
                </div>

                <Row lg={"5"} md={"4"} sm={"2"} xs={"2"}>
                    {books.map(items =>
                        <Col>
                            <div className="book-card">
                                <Image
                                    src={items.cpver_image}
                                    className="thumbnail rounded w-100" />
                                <div className="book-info text-center mt-2">
                                    <div className="author-name">
                                        {items.author}
                                    </div>
                                    <div className="book-name">
                                        {items.title}
                                    </div>
                                    <div className="book-price">
                                        ₹ {items.price}/-
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}


                </Row>

                <Button className="ml-2 px-4 align-items-center d-flex mx-auto mt-4">
                    View More
                </Button>
            </Container>
        </>
    )
}

export default HomePage;