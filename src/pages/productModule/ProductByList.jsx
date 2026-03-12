import { Button, Col, Form, Image, Row } from "react-bootstrap";
import ProductItemUI from "../../components/ProductItemUI";
import ProductCardSkeleton from "../../components/skeletons/ProductCardSkeleton";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import Select from 'react-select';
import '../../styles/filters.scss';

function ProductByList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { setIsContentLoading } = useOutletContext();

    const [categoriesList, setCategoriesList] = useState([]);
    const [catListShow, setCatListShow] = useState(true);
    const [selectedCat, setSelectedCat] = useState([]);
    const [searchByAuthorText, setSearchByAuthorText] = useState('');
    const [searchByState, setSearchByState] = useState('');
    const [searchByCity, setSearchByCity] = useState('');
    const [cityList, setCityList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [isProductLoading, setIsProductLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Refs
    const isMounted = useRef(true);
    const debounceTimerRef = useRef(null);
    const initialLoadDone = useRef(false);

    // Derived values
    const isSellShareMode = location?.state === 'Sell/Share';
    const searchTextParam = searchParams.get('st');
    const loggedUserId = useMemo(() => Auth.loggedInUser()?.id, []);

    // Category selection handler
    const selectedCatHandler = useCallback((catID) => {
        setSelectedCat(prev => {
            if (prev.includes(catID)) {
                return prev.filter(n => n !== catID);
            }
            return [...prev, catID];
        });
    }, []);

    // Memoized product list handler
    const getProductListHandler = useCallback(async (filters) => {
        const { search, author, state, city, categories } = filters;

        setIsContentLoading(true);
        setIsProductLoading(true);

        const params = new URLSearchParams({ page: 1, size: 50 });

        if (search) params.append('searching', search);
        if (author) params.append('auther_searching', author);
        if (state) params.append('state', state);
        if (city) params.append('city', city);

        if (isSellShareMode && loggedUserId) {
            params.append('user_id', loggedUserId);
        }

        if (categories?.length > 0) {
            categories.forEach((cat, index) => {
                params.append(`category[${index}]`, cat);
            });
        }

        try {
            const response = await axiosInstance.get(`product?${params}`);
            if (response && isMounted.current) {
                let data = response?.data?.data || [];

                if (isSellShareMode && data.length > 0) {
                    data = data.filter(item => item?.created_by_user?.id === loggedUserId);
                }

                setProductList(data);
            }
        } catch (error) {
            console.error('Failed to load products');
        } finally {
            if (isMounted.current) {
                setIsContentLoading(false);
                setIsProductLoading(false);
            }
        }
    }, [isSellShareMode, loggedUserId, setIsContentLoading]);

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

    // Debounced search handler
    const handleFilterChange = useCallback((value, type) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            if (type === 'state') setSearchByState(value || '');
            if (type === 'city') setSearchByCity(value || '');
            if (type === 'author') setSearchByAuthorText(value || '');
        }, 500);
    }, []);

    // Load state/city data
    useEffect(() => {
        isMounted.current = true;

        fetch('/cityState.json', {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                if (isMounted.current) {
                    setStateList(data || []);
                }
            })
            .catch(() => { });

        return () => {
            isMounted.current = false;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Initial load - categories
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'My Book List | Kitaab Junction';

        if (!isSellShareMode) {
            getCategoriesListHandler();
        }

    }, [isSellShareMode, getCategoriesListHandler]);

    // Load products when filters change
    useEffect(() => {
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
        }

        getProductListHandler({
            search: searchTextParam,
            author: searchByAuthorText,
            state: searchByState,
            city: searchByCity,
            categories: selectedCat
        });
    }, [selectedCat, searchByAuthorText, searchByState, searchByCity, searchTextParam, getProductListHandler]);

    return (
        <>
            <div className="h2 mt-4 font-weight-bold d-flex justify-content-between">
                {isSellShareMode ? 'Sell/Share list' : 'Books list'}
                {Auth.isUserAuthenticated() && (
                    <Button className="mb-3" onClick={() => navigate('add')} type="button">
                        Add Product
                    </Button>
                )}
            </div>

            <Row className="mt-4">
                {!isSellShareMode && (
                    <>
                        <Col lg={12} className="d-lg-none mb-3">
                            <button
                                className="mobile-filter-toggle"
                                onClick={() => setShowMobileFilters(true)}
                                type="button"
                            >
                                <i className="bi bi-funnel"></i> Show Filters
                            </button>
                        </Col>

                        <div
                            className={`filter-backdrop ${showMobileFilters ? 'show' : ''}`}
                            onClick={() => setShowMobileFilters(false)}
                        />

                        <Col lg={3} className={`filter-sidebar mb-4 ${showMobileFilters ? 'show' : ''}`}>
                            <button
                                className="filter-close-btn"
                                onClick={() => setShowMobileFilters(false)}
                                type="button"
                            >
                                ×
                            </button>

                            <div className="filter-section">
                                <Form.Label className="filter-label">Location</Form.Label>
                                <Form.Group className="mb-3" controlId="stateSelect">
                                    <Select
                                        options={stateList}
                                        id="stateId"
                                        isClearable
                                        placeholder="Select State"
                                        className="css-control"
                                        onChange={(option) => {
                                            setCityList(option?.cities || []);
                                            handleFilterChange(option?.value, 'state');
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="citySelect">
                                    <Select
                                        options={cityList}
                                        id="cityId"
                                        isClearable
                                        placeholder="Select City"
                                        className="css-control"
                                        onChange={(option) => handleFilterChange(option?.value, 'city')}
                                    />
                                </Form.Group>
                            </div>

                            <div className="filter-section">
                                <Form.Group controlId="authorName">
                                    <Form.Label className="filter-label">Author Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoComplete="off"
                                        name="AuthorName"
                                        onChange={(e) => handleFilterChange(e.target.value, 'author')}
                                        placeholder="Search by author"
                                    />
                                </Form.Group>
                            </div>

                            <div>
                                <button
                                    className={`category-toggle ${catListShow ? 'active' : ''}`}
                                    onClick={() => setCatListShow(!catListShow)}
                                    type="button"
                                >
                                    <span>Categories</span>
                                    <Image
                                        className="dropdown-icon"
                                        src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}dropdown-arrow.svg`}
                                    />
                                </button>

                                {catListShow && (
                                    <ul className="category-list pl-0 list-unstyled">
                                        {categoriesList.map((cl) => (
                                            <li key={cl.id}>
                                                <label
                                                    htmlFor={`cat-${cl.id}`}
                                                    className={`checkbox-item ${productList.length === 0 && selectedCat.length === 0 ? 'disabled' : ''}`}
                                                >
                                                    {cl.name}
                                                    <input
                                                        disabled={productList.length === 0 && selectedCat.length === 0}
                                                        type="checkbox"
                                                        id={`cat-${cl.id}`}
                                                        onChange={() => selectedCatHandler(cl.id)}
                                                        checked={selectedCat.includes(cl.id)}
                                                        name="categories"
                                                    />
                                                    <span className="checkbox mr-2" />
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Col>
                    </>
                )}

                <Col lg={isSellShareMode ? 12 : 9}>
                    {searchTextParam && (
                        <div className="product-list-header">
                            <div className="search-filter-tag">
                                <span>Search filter:</span>
                                <span className="filter-text">{searchTextParam}</span>
                                <span className="close-filter" onClick={() => navigate('/product')}>
                                    ×
                                </span>
                            </div>
                        </div>
                    )}

                    {!isProductLoading && productList.length === 0 && (
                        <div className="empty-state">
                            <Image width="250" src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}no-product.png`} />
                            <div className="empty-text">No products found</div>
                        </div>
                    )}

                    <Row md="4" sm="2" xs="2">
                        {isProductLoading && <ProductCardSkeleton cards={12} className="mb-4" />}
                        {!isProductLoading && productList.map((items) => (
                            <ProductItemUI
                                key={items._id || items.id}
                                items={items}
                                className="mb-4 px-2"
                            />
                        ))}
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default ProductByList;
