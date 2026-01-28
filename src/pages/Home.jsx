import { Button, Col, Container, Image, Row } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate, useOutletContext } from "react-router-dom";
import ProductItemUI from "../components/ProductItemUI";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { axiosInstance } from "../axios/axios-config";
import { MEDIA_URL, replaceLogo } from "../helper/Utils";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

function HomePage() {
    const navigate = useNavigate();
    const { setIsContentLoading } = useOutletContext();

    const [categoriesList, setCategoriesList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [isProductLoading, setIsProductLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isSearchContentLoading, setIsSearchContentLoading] = useState(false);
    const [searchedContentList, setSearchedContentList] = useState([]);
    const [selectCatID, setSelectCatID] = useState(null);

    // Refs for cleanup and debounce
    const isMounted = useRef(true);
    const searchDebounceRef = useRef(null);
    const initialLoadDone = useRef(false);

    // Memoized categories handler
    const getCategoriesListHandler = useCallback(async () => {
        try {
            setIsContentLoading(true);
            const response = await axiosInstance.get('category?page=1&size=50');
            if (response && isMounted.current) {
                setCategoriesList(response?.data?.data || []);
            }
        } catch (error) {
            console.error('Failed to load categories');
        } finally {
            if (isMounted.current) {
                setIsContentLoading(false);
            }
        }
    }, [setIsContentLoading]);

    // Memoized products by category handler
    const getProductByCat = useCallback(async (catID) => {
        try {
            setIsContentLoading(true);
            setIsProductLoading(true);

            const params = new URLSearchParams({ page: 1, size: 10 });
            if (catID) {
                params.append('category[0]', catID);
            }

            const response = await axiosInstance.get(`product?${params}`);
            if (response && isMounted.current) {
                setProductList(response?.data?.data || []);
            }
        } catch (error) {
            console.error('Failed to load products');
        } finally {
            if (isMounted.current) {
                setIsContentLoading(false);
                setIsProductLoading(false);
            }
        }
    }, [setIsContentLoading]);

    // Memoized search handler
    const getProductListBySearchText = useCallback(async (text) => {
        if (!text) return;

        try {
            setIsSearchContentLoading(true);
            const params = new URLSearchParams({ page: 1, size: 20, searching: text });
            const response = await axiosInstance.get(`product?${params}`);
            if (response && isMounted.current) {
                setSearchedContentList(response?.data?.data || []);
            }
        } catch (error) {
            console.error('Search failed');
        } finally {
            if (isMounted.current) {
                setIsSearchContentLoading(false);
            }
        }
    }, []);

    // Debounced search handler using ref
    const handleSearch = useCallback((text) => {
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        searchDebounceRef.current = setTimeout(() => {
            setSearchText(text);
        }, 500);
    }, []);

    // Initial load - categories and products (only once)
    useEffect(() => {
        isMounted.current = true;
        document.title = 'Home | Kitaab Junction';

        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            getCategoriesListHandler();
            getProductByCat(null);
        }

        return () => {
            isMounted.current = false;
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, [getCategoriesListHandler, getProductByCat]);

    // Search effect - only when searchText changes
    useEffect(() => {
        if (searchText) {
            getProductListBySearchText(searchText);
        }
    }, [searchText, getProductListBySearchText]);

    // Category change effect - skip initial load
    useEffect(() => {
        if (initialLoadDone.current && selectCatID !== null) {
            getProductByCat(selectCatID || null);
        }
    }, [selectCatID, getProductByCat]);

    // Handle category selection
    const handleCategoryClick = useCallback((catId) => {
        setSelectCatID(catId);
        if (catId === undefined) {
            getProductByCat(null);
        }
    }, [getProductByCat]);

    // Memoized search result renderer
    const renderSearchResult = useCallback((option) => (
        <span onClick={() => navigate('/product/product-detail', { state: { productId: option.id } })}>
            <img
                onError={replaceLogo}
                alt={option.title}
                loading="lazy"
                src={MEDIA_URL + 'product/' + option.image}
                style={{ height: '24px', marginRight: '10px', width: '24px' }}
            />
            <span>{option.title}</span>
        </span>
    ), [navigate]);

    // Memoized category buttons
    const categoryButtons = useMemo(() => (
        <>
            <button
                type="button"
                onClick={() => handleCategoryClick(undefined)}
                className={`category-btn ${!selectCatID ? 'active' : ''}`}
            >
                All
            </button>
            {categoriesList.map((cl) => (
                <button
                    type="button"
                    onClick={() => handleCategoryClick(cl.id)}
                    className={`category-btn ${selectCatID === cl.id ? 'active' : ''}`}
                    key={cl.id}
                >
                    {cl.name}
                </button>
            ))}
        </>
    ), [categoriesList, selectCatID, handleCategoryClick]);

    return (
        <>
            <Row className="banner-row justify-content-center align-items-center mb-5">
                <Col lg={9} className="text-center mt-4">
                    <span className="h3 find-book-heading">Find the books that you are looking for</span>
                    <InputGroup className="mb-3 mt-3 bg-white p-2 rounded">
                        <AsyncTypeahead
                            filterBy={() => true}
                            id="async-example"
                            isLoading={isSearchContentLoading}
                            labelKey="title"
                            className="border-0 p-0 form-control rounded"
                            minLength={3}
                            onSearch={handleSearch}
                            options={searchedContentList}
                            placeholder="Search Books by Title, Author"
                            renderMenuItemChildren={renderSearchResult}
                        />
                        <Button
                            id="basic-addon2"
                            onClick={() => {
                                if (searchText) {
                                    navigate('/product?st=' + searchText);
                                }
                            }}
                            className="ml-2 px-4 align-items-center d-flex"
                        >
                            <Image
                                className="mr-2"
                                src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}search-icon-white.svg`}
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
                <div className="category-container">
                    <div className="category-scroll-wrapper">
                        <div className="category-list">
                            {categoryButtons}
                        </div>
                    </div>
                </div>

                {!isProductLoading && productList.length === 0 && (
                    <div style={{ height: '200px' }} className="text-center pt-5 h2 fw-bold">
                        No product found!
                    </div>
                )}

                <Row lg="5" md="4" sm="2" xs="2" className="justify-content-center">
                    {isProductLoading && <ProductCardSkeleton cards={10} />}
                    {!isProductLoading && productList.map((items) => (
                        <ProductItemUI key={items.id} items={items} className="px-2" />
                    ))}
                </Row>

                {!isProductLoading && (
                    <Button
                        onClick={() => navigate('/product', { state: { productId: selectCatID } })}
                        variant="dark"
                        disabled={productList.length === 0}
                        className="ml-2 px-4 align-items-center d-flex mx-auto mt-5"
                    >
                        View More
                    </Button>
                )}
            </Container>
        </>
    );
}

export default HomePage;
