import { Button, Col, Image, Row } from "react-bootstrap";
import ProductItemUI from "../../components/ProductItemUI";
import { srcPriFixLocal } from "../../helper/Helper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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


function ProductByList() {

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Row className="mt-4">
            <Col lg={3}>
                {/* <Button
                    variant=""
                    className="d-flex justify-content-between w-100"
                    type="button">Filters <Image className="dropdown-icon" src={`${srcPriFixLocal}dropdown-arrow.svg`} />
                </Button>
                <ul>
                    <li></li>
                </ul> */}
                <Button
                    variant=""
                    className="d-flex justify-content-between w-100 pl-0 "
                    type="button">Categories <Image className="dropdown-icon align-self-center" src={`${srcPriFixLocal}dropdown-arrow.svg`} />
                </Button>

                <ul className="pl-0 list-unstyled">
                    {CategoriesList.map((cl, index) =>
                        <li key={index + 'cl'}>
                            <label for={index + 'cl'} className="checkbox-item">{cl}
                                <input type="checkbox" id={index + 'cl'} name="categories" aria-checked="false" />
                                <span className="checkbox mr-2"></span>
                            </label>
                        </li>
                    )}

                </ul>
                <Button
                    variant=""
                    className="d-flex justify-content-between w-100 pl-0"
                    type="button">Author <Image className="dropdown-icon align-self-center" src={`${srcPriFixLocal}dropdown-arrow.svg`} />
                </Button>

                <ul className="pl-0 list-unstyled">
                    {CategoriesList.map((cl, index) =>
                        <li key={index + 'cll'}>
                            <label for={index + 'cll'} className="checkbox-item">{cl}
                                <input type="checkbox" id={index + 'cll'} name="Author" aria-checked="false" />
                                <span className="checkbox mr-2"></span>
                            </label>
                        </li>
                    )}
                </ul>
            </Col>
            <Col lg={9} >
                <div className="text-right">
                    <Button className="mb-3" onClick={() => navigate('add')} type="button">Add Product</Button>
                </div>
                <Row md={"4"} sm={"2"} xs={"2"} >

                    {books.map(items =>
                        <ProductItemUI items={items} className="mb-4" />
                    )}
                </Row>
            </Col>
        </Row>
    )
}

export default ProductByList;