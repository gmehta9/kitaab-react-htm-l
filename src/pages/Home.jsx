import { Button, Col, Container, Image, Row } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate, useOutletContext } from "react-router-dom";
import ProductItemUI from "../components/ProductItemUI";
import { srcPriFixLocal } from "../helper/Helper";
import React, { useCallback, useEffect, useState } from "react";
import { axiosInstance, headers } from "../axios/axios-config";
import Auth from "../auth/Auth";
import { MEDIA_URL, debounce, replaceLogo } from "../helper/Utils";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

// const books = [
//     {
//         id: 1,
//         title: 'Vintage Grazie',
//         author: 'Markrem Hoddel',
//         cpver_image: './assets/images/book-1.jpg',
//         price: '10'
//     },
//     {
//         id: 2,
//         title: 'Vintage Grazie',
//         author: 'Markrem Hoddel',
//         cpver_image: './assets/images/book-2.jpg',
//         price: '99'
//     },
//     {
//         id: 3,
//         title: 'Vintage Grazie',
//         author: 'Markrem Hoddel',
//         cpver_image: './assets/images/book-3.jpg',
//         price: '199'
//     },
//     {
//         id: 4,
//         title: 'Vintage Grazie',
//         author: 'Markrem Hoddel',
//         cpver_image: './assets/images/book-4.jpg',
//         price: '349'
//     },
//     {
//         id: 5,
//         title: 'Vintage Grazie',
//         author: 'Markrem Hoddel',
//         cpver_image: './assets/images/book-5.jpg',
//         price: '250'
//     }
// ]

function HomePage() {
    const navigate = useNavigate()
    const [categoriesList, setCategoriesList] = useState()

    const [productList, setProductList] = useState()
    const [searchText, setSearchText] = useState()
    const [isSearchContentLoading, setIsSearchContentLoading] = useState(false)
    const [searchedContentList, setSearchedContentList] = useState([])

    const [selectCatID, setSelectCatID] = useState()
    const { setIsContentLoading } = useOutletContext()

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
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
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


    const getProductByCat = async (p, catID) => {
        setIsContentLoading(true)
        const params = {
            page: p,
            size: 10,
        };
        let APIUrl = 'product'

        if (catID) {
            params['category[0]'] = catID
        }

        axiosInstance.get(`${APIUrl}?${new URLSearchParams(params)}`, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            },
        }).then((response) => {
            if (response) {
                setProductList(response?.data?.data)
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };


    const getProductListBySearchText = async (searchText) => {
        setIsSearchContentLoading(true)
        const params = {
            page: 1,
            size: 20,
        };
        let APIUrl = 'product'

        if (searchText) {
            params.searching = searchText
        }

        axiosInstance.get(`${APIUrl}?${new URLSearchParams(params)}`, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            },
        }).then((response) => {
            if (response) {
                console.log(response?.data?.data);
                setSearchedContentList(response?.data?.data)
                setIsSearchContentLoading(false)
            }
        }).catch((error) => {
            setIsSearchContentLoading(false)
        });
    };

    const serachtext = debounce((event) => {
        console.log(event);
        setSearchText(event)
    }, 500)

    useEffect(() => {
        if (searchText) {
            getProductListBySearchText(searchText)
        }
    }, [searchText])
    useEffect(() => {
        getCategoriesListHandler(1)
        document.title = `Home | Kitaab Juction`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getProductByCat(1, selectCatID)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectCatID])

    return (
        <>
            <Row className="banner-row justify-content-center align-items-center mb-5">
                <Col lg={9} className="text-center mt-4">
                    <span className="h3 find-book-heading ">Find the books that you are looking for</span>
                    <InputGroup className="mb-3 mt-3 bg-white p-2 rounded">
                        {/* <Form.Control
                            className="border-0 rounded"
                            placeholder="Search Books....."
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={serachtext}
                        /> */}
                        <AsyncTypeahead
                            filterBy={() => true}
                            id="async-example"
                            isLoading={isSearchContentLoading}
                            labelKey="title"
                            className="border-0 p-0 form-control rounded"
                            minLength={3}
                            onSearch={serachtext}
                            options={searchedContentList}
                            placeholder="Search Books by Title, Author"
                            renderMenuItemChildren={(option) => (
                                <span onClick={() => navigate('/product/product-detail', {
                                    state: {
                                        productId: option.id
                                    }
                                })}>
                                    <img
                                        onError={replaceLogo}
                                        alt={option.title}
                                        src={MEDIA_URL + 'product/' + option.image}
                                        style={{
                                            height: '24px',
                                            marginRight: '10px',
                                            width: '24px',
                                        }}
                                    />
                                    <span>{option.title}</span>
                                </span>
                            )}
                        />
                        <Button id="basic-addon2"
                            onClick={() => {
                                if (!searchText || searchText === '') {
                                    return
                                }
                                navigate('/product?st=' + searchText)
                            }}
                            className="ml-2 px-4 align-items-center d-flex">
                            <Image
                                className="mr-2"
                                src={`${srcPriFixLocal}search-icon-white.svg`}
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
                    <div className="p-0 row justify-content-center my-4">
                        <button type="button"
                            onClick={() => {
                                setSelectCatID(undefined)
                            }}
                            className={` btn mx-2 rounded-0 bg-transparent px-0 mx-3 ${!selectCatID ? ' text-primary border-bottom' : 'border-0'}`}>
                            All
                        </button>

                        {categoriesList && categoriesList.map((cl, index) =>
                            <button type="button"
                                onClick={() => {
                                    setSelectCatID(cl?.id)
                                    // navigate('/product', {
                                    //     state: { name: cl?.name, catID: cl?.id }
                                    // })
                                }}
                                className={`btn mx-2 rounded-0 bg-transparent px-0 mx-3 ${selectCatID === cl?.id ? ' text-primary border-bottom' : 'border-0'}`}
                                key={index + 'cl'}>
                                {cl?.name}
                            </button>
                        )}

                    </div>
                </div>
                {productList?.length === 0 &&
                    <div
                        style={{ height: '200px' }}
                        className="text-center pt-5 h2 fw-bold">
                        No product found!
                    </div>
                }
                <Row lg={"5"} md={"4"} sm={"2"} xs={"2"} className="justify-content-center">

                    {productList && productList.map((items, index) =>
                        <React.Fragment key={index + 'prd'}>
                            <ProductItemUI items={items} />
                        </React.Fragment>
                    )}

                </Row>

                <Button
                    onClick={() => navigate('/product', {
                        state: {
                            productId: selectCatID
                        }
                    })}
                    variant="dark"
                    disabled={productList?.length === 0}
                    className="ml-2 px-4 align-items-center d-flex mx-auto mt-5">
                    View More
                </Button>
            </Container>
        </>
    )
}

export default HomePage;