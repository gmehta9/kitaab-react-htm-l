import { Button, Col, Form, Image, Row } from "react-bootstrap";
import ProductItemUI from "../../components/ProductItemUI";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import { debounce } from "../../helper/Utils";
import Select from 'react-select'
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

                console.log('response?.data?.data', response?.data?.data);

                let useData = response?.data?.data
                if (location?.state === 'Sell/Share' && response?.data?.data.length > 0) {

                    useData = response?.data?.data.filter(pItem => pItem?.created_by_user.id === Auth.loggedInUser()?.id)
                }

                setProductList(useData)
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
        console.log(event, type);
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
        fetch('cityState.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            console.log(myJson);
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
                        <Col lg={3} className="mb-4">
                            <Form.Group className="mb-2" controlId="name">
                                <Form.Label>Search by State & City</Form.Label>
                                <Select
                                    options={stateList}
                                    id="stateId"
                                    isClearable={true}
                                    onChange={(event) => {
                                        setCityList(event?.cities)
                                        serachtext(event?.value, 'state')
                                    }}
                                />
                                {/* <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    name="CityName"
                                    className="small"
                                    onChange={(event) => serachtext(event.target.value, 'state')}
                                    placeholder="State Name"
                                /> */}
                            </Form.Group>
                            <Form.Group className="mb-4" controlId="name">
                                <Select
                                    options={cityList}
                                    id="cityId"
                                    isClearable={true}
                                    onChange={(event) => serachtext(event?.value, 'city')}
                                />
                                {/* <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    name="CityName"
                                    onChange={(event) => serachtext(event.target.value, 'city')}
                                    placeholder="City Name"
                                /> */}
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="name">
                                <Form.Label>Author Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoComplete="false"
                                    name="CityName"
                                    className="small"
                                    onChange={(event) => serachtext(event.target.value, 'author')}
                                    placeholder="Author Name"
                                // autoFocus="false"
                                />
                            </Form.Group>
                            <Button
                                variant=""
                                onClick={() => setCatListShow(!catListShow)}
                                className="d-flex justify-content-between w-100 pl-0 "
                                type="button">Categories
                                <Image className={`dropdown-icon align-self-center ${catListShow ? 'rotate-drop' : ''}`} src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}dropdown-arrow.svg`} />
                            </Button>

                            {catListShow &&
                                <ul className="pl-0 list-unstyled">
                                    {categoriesList && categoriesList.map((cl, index) =>
                                        <li key={index + 'cls'} >
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
                            {/* <Button
                    variant=""
                    className="d-flex justify-content-between w-100 pl-0"
                    type="button">Author <Image className="dropdown-icon align-self-center" src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}dropdown-arrow.svg`} />
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
                    </>
                }
                <Col lg={location?.state === 'Sell/Share' ? 12 : 9} >
                    <div className="d-flex justify-content-between">
                        <span className="">
                            {searchParams.get('st') && <>Search filter:
                                <span
                                    className="font-weight-bold ml-1">{searchParams.get('st')}</span>
                                <span
                                    className="text-white bg-dark rounded-circle cross-icon ml-1 link"
                                    onClick={() => navigate('/product')}>×</span>
                            </>}
                        </span>

                    </div>
                    {productList?.length === 0 &&
                        <Row>
                            <div
                                style={{ height: '300px' }}
                                className="text-center w-100 pt-5 h2 font-weight-bold">
                                <Image width="250" src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}no-product.png`} />
                            </div>
                        </Row>
                    }
                    <Row md={"4"} sm={"2"} xs={"2"} >

                        {productList && productList.map((items, index) =>
                            <React.Fragment key={index + 'prd'}>
                                <ProductItemUI items={items} isEditAble={isEditAble} className="mb-4" />
                            </React.Fragment>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default ProductByList;