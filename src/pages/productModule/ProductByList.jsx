import { Button, Col, Form, Image, Row } from "react-bootstrap";
import ProductItemUI from "../../components/ProductItemUI";
import ProductCardSkeleton from "../../components/skeletons/ProductCardSkeleton";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import { debounce } from "../../helper/Utils";
import Select from 'react-select';
import '../../styles/filters.scss';
// const CategoriesList = ["All", "School", "Professional Courses", "Regular Courses", "Fiction", "Non - Fiction", "Competitive Exams", "Others"]


function ProductByList() {

    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const { setIsContentLoading } = useOutletContext()
    const [categoriesList, setCategoriesList] = useState()
    const [isEditAble, setIsEditAble] = useState(false)
    const [catListShow, setCatListShow] = useState(true)
    const [selectedCat, setSelectedCat] = useState([])
    const [searchByAuthorText, setSearchByAuthorText] = useState()
    const [searchByState, setSearchByState] = useState()
    const [searchByCity, setSearchByCity] = useState()

    const [cityList, setCityList] = useState()
    const [stateList, setStateList] = useState()

    const [productList, setProductList] = useState()
    const [isProductLoading, setIsProductLoading] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)

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

    const getProductListHandler = async (p, search, author, searchByState, searchByCity) => {
        setIsContentLoading(true)
        setIsProductLoading(true)
        const params = {
            page: p,
            size: 50,
        };
        let APIUrl = 'product'
        if (search) {
            params.searching = search
        }
        if (author) {
            // params['author[0]'] = author
            params['auther_searching'] = author
        }
        if (searchByState) {
            params['state'] = searchByState
        }
        if (location.state === 'Sell/Share') {
            params.user_id = Auth.loggedInUser().id
        }
        if (searchByCity) {
            params['city'] = searchByCity
        }
        if (selectedCat.length > 0) {
            selectedCat.forEach((elm, index) => {
                params[`category[${index}]`] = elm
            })
        }

        axiosInstance.get(`${APIUrl}?${new URLSearchParams(params)}`).then((response) => {
            if (response) {
                let useData = response?.data?.data
                if (location?.state === 'Sell/Share' && response?.data?.data.length > 0) {

                    useData = response?.data?.data.filter(pItem => pItem?.created_by_user.id === Auth.loggedInUser()?.id)
                }

                setProductList(useData)
                setIsContentLoading(false)
                setIsProductLoading(false)

            }
        }).catch((error) => {
            setIsContentLoading(false)
            setIsProductLoading(false)
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

        axiosInstance.get(`${APIUrl}?${new URLSearchParams(params)}`).then((response) => {
            if (response) {
                setCategoriesList(response?.data?.data)
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const serachtext = debounce((event, type) => {
        if (type === 'state') {
            setSearchByState(event)
        }
        if (type === 'city') {
            setSearchByCity(event)
        }
        if (type === 'author') {
            setSearchByAuthorText(event)
        }
    }, 500)

    useEffect(() => {
        window.scrollTo(0, 0)
        // getProductListHandler(1)
        if (location?.state !== 'Sell/Share') {
            getCategoriesListHandler(1)
        }
        document.title = 'My Book List | Kitaab Juction';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        getProductListHandler(1, searchParams.get('st'), searchByAuthorText, searchByState, searchByCity)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCat, searchByAuthorText, searchByState, searchByCity, searchParams.get('st')])

    useEffect(() => {
        if (location?.state === 'Sell/Share') {
            setIsEditAble(true)
        }
    }, [location?.state])

    useEffect(() => {
        fetch('/cityState.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            // let cityies = []
            // myJson.forEach(itm => {
            //     cityies = [...cityies, ...itm.cities]
            // })
            setStateList(myJson)
        })
    }, [])


    return (
        <>
            <div className="h2 mt-4 font-weight-bold d-flex justify-content-between">
                {location?.state === 'Sell/Share' ? 'Sell/Share list' : 'Books list'}
                {Auth.isUserAuthenticated() &&
                    <Button
                        className="mb-3"
                        onClick={() => navigate('add')}
                        type="button">Add Product</Button>
                }
            </div>
            <Row className="mt-4">
                {location?.state !== 'Sell/Share' &&
                    <>
                        {/* Mobile Filter Toggle */}
                        <Col lg={12} className="d-lg-none mb-3">
                            <button
                                className="mobile-filter-toggle"
                                onClick={() => setShowMobileFilters(true)}
                                type="button">
                                <i className="bi bi-funnel"></i> Show Filters
                            </button>
                        </Col>

                        {/* Filter Backdrop for Mobile */}
                        <div
                            className={`filter-backdrop ${showMobileFilters ? 'show' : ''}`}
                            onClick={() => setShowMobileFilters(false)}
                        ></div>

                        {/* Filter Sidebar */}
                        <Col lg={3} className={`filter-sidebar mb-4 ${showMobileFilters ? 'show' : ''}`}>
                            <button
                                className="filter-close-btn"
                                onClick={() => setShowMobileFilters(false)}
                                type="button">
                                ×
                            </button>

                            {/* Location Filter */}
                            <div className="filter-section">
                                <Form.Label className="filter-label">Location</Form.Label>
                                <Form.Group className="mb-3" controlId="stateSelect">
                                    <Select
                                        options={stateList}
                                        id="stateId"
                                        isClearable={true}
                                        placeholder="Select State"
                                        className="css-control"
                                        onChange={(event) => {
                                            setCityList(event?.cities)
                                            serachtext(event?.value, 'state')
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="citySelect">
                                    <Select
                                        options={cityList}
                                        id="cityId"
                                        isClearable={true}
                                        placeholder="Select City"
                                        className="css-control"
                                        onChange={(event) => serachtext(event?.value, 'city')}
                                    />
                                </Form.Group>
                            </div>

                            {/* Author Filter */}
                            <div className="filter-section">
                                <Form.Group controlId="authorName">
                                    <Form.Label className="filter-label">Author Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        autoComplete="off"
                                        name="AuthorName"
                                        onChange={(event) => serachtext(event.target.value, 'author')}
                                        placeholder="Search by author"
                                    />
                                </Form.Group>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <button
                                    className={`category-toggle ${catListShow ? 'active' : ''}`}
                                    onClick={() => setCatListShow(!catListShow)}
                                    type="button">
                                    <span>Categories</span>
                                    <Image
                                        className="dropdown-icon"
                                        src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}dropdown-arrow.svg`}
                                    />
                                </button>

                                {catListShow &&
                                    <ul className="category-list pl-0 list-unstyled">
                                        {categoriesList && categoriesList.map((cl, index) =>
                                            <li key={index + 'cls'}>
                                                <label
                                                    htmlFor={index + 'cl'}
                                                    className={`checkbox-item ${productList?.length === 0 && (selectedCat?.length > 0 ? false : true) && 'disabled'}`}>
                                                    {cl?.name}
                                                    <input
                                                        disabled={productList?.length === 0 && (selectedCat?.length > 0 ? false : true)}
                                                        type="checkbox"
                                                        id={index + 'cl'}
                                                        onChange={() => selectedCatHandler(cl?.id)}
                                                        name="categories"
                                                        aria-checked="false"
                                                    />
                                                    <span className="checkbox mr-2"></span>
                                                </label>
                                            </li>
                                        )}
                                    </ul>
                                }
                            </div>
                        </Col>
                    </>
                }
                <Col lg={location?.state === 'Sell/Share' ? 12 : 9} >
                    {/* Search Filter Tag */}
                    {searchParams.get('st') &&
                        <div className="product-list-header">
                            <div className="search-filter-tag">
                                <span>Search filter:</span>
                                <span className="filter-text">{searchParams.get('st')}</span>
                                <span
                                    className="close-filter"
                                    onClick={() => navigate('/product')}>
                                    ×
                                </span>
                            </div>
                        </div>
                    }

                    {/* Empty State */}
                    {(!isProductLoading && productList?.length === 0) &&
                        <div className="empty-state">
                            <Image width="250" src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}no-product.png`} />
                            <div className="empty-text">No products found</div>
                        </div>
                    }
                    <Row md={"4"} sm={"2"} xs={"2"} >

                        {isProductLoading && <ProductCardSkeleton cards={12} className="mb-4" />}

                        {!isProductLoading && productList && productList.map((items, index) =>
                            <React.Fragment key={index + 'prd'}>
                                <ProductItemUI items={items} isEditAble={isEditAble} className="mb-4 px-2" />
                            </React.Fragment>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default ProductByList;