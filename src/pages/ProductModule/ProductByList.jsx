import { Button, Col, Image, Row } from "react-bootstrap";
import ProductItemUI from "../../components/ProductItemUI";
import { srcPriFixLocal } from "../../helper/Helper";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";

// const CategoriesList = ["All", "School", "Professional Courses", "Regular Courses", "Fiction", "Non - Fiction", "Competitive Exams", "Others"]


function ProductByList() {

    const navigate = useNavigate()
    const { setIsContentLoading } = useOutletContext()
    const [categoriesList, setCategoriesList] = useState()
    const [selectedCat, setSelectedCat] = useState([])

    const [productList, setProductList] = useState()

    const selectedCatHandler = (catID) => {
        // selectedCat
        // setSelectedCat
        if (selectedCat && selectedCat.includes(catID)) {
            // Number exists, remove it
            setSelectedCat(selectedCat.filter((n) => n !== catID));
        } else {
            // Number doesn't exist, add it
            setSelectedCat([...selectedCat, catID]);
        }
    }

    const getProductListHandler = async (p) => {
        setIsContentLoading(true)
        const params = {
            page: p,
            size: 50,
        };
        let APIUrl = 'product'
        if (selectedCat.length > 0) {
            selectedCat.forEach((elm, index) => {
                params[`category[${index}]`] = elm
            })
        }

        axiosInstance.get(`${APIUrl}?${new URLSearchParams(params)}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            },
        }).then((response) => {
            if (response) {

                console.log('response?.data?.data', response?.data?.data);

                setProductList(response?.data?.data)
                setIsContentLoading(false)

            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    const getCategoriesListHandler = useCallback(async (p) => {
        setIsContentLoading(true)
        const params = {
            page: p,
            size: 50,
        };
        let APIUrl = 'category'

        axiosInstance.get(`${APIUrl}?${new URLSearchParams(params)}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            },
        }).then((response) => {
            if (response) {
                setCategoriesList(response?.data?.data)
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
        getProductListHandler(1)
        getCategoriesListHandler(1)
    }, [])

    useEffect(() => {
        getProductListHandler(1)
    }, [selectedCat])


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
                    {categoriesList && categoriesList.map((cl, index) =>
                        <li key={index + 'cls'}>
                            <label htmlFor={index + 'cl'} className="checkbox-item">{cl?.name}
                                <input type="checkbox" id={index + 'cl'} onChange={() => selectedCatHandler(cl?.id)} name="categories" aria-checked="false" />
                                <span className="checkbox mr-2"></span>
                            </label>
                        </li>
                    )}

                </ul>
                {/* <Button
                    variant=""
                    className="d-flex justify-content-between w-100 pl-0"
                    type="button">Author <Image className="dropdown-icon align-self-center" src={`${srcPriFixLocal}dropdown-arrow.svg`} />
                </Button> */}

                {/* <ul className="pl-0 list-unstyled">
                    {CategoriesList.map((cl, index) =>
                        <li key={index + 'cll'}>
                            <label for={index + 'cll'} className="checkbox-item">{cl}
                                <input type="checkbox" id={index + 'cll'} name="Author" aria-checked="false" />
                                <span className="checkbox mr-2"></span>
                            </label>
                        </li>
                    )}
                </ul> */}
            </Col>
            <Col lg={9} >
                <div className="text-right">
                    <Button className="mb-3" onClick={() => navigate('add')} type="button">Add Product</Button>
                </div>
                {productList?.length === 0 &&
                    <Row>
                        <div
                            style={{ height: '200px' }}
                            className="text-center w-100 pt-5 h2 font-weight-bold">
                            <Image width="250" src={`${srcPriFixLocal}no-product.png`} />
                        </div>
                    </Row>
                }
                <Row md={"4"} sm={"2"} xs={"2"} >

                    {productList && productList.map((items, index) =>
                        <React.Fragment key={index + 'prd'}>
                            <ProductItemUI items={items} className="mb-4" />
                        </React.Fragment>
                    )}
                </Row>
            </Col>
        </Row>
    )
}

export default ProductByList;