import { Button, Container, Image, InputGroup, Row } from "react-bootstrap";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
// import Footer from "../../components/Footer";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
// import { axiosInstance } from "../../axios/axios-config";
// import Auth from "../../auth/Auth";
import { useEffect, useState } from "react";
import { debounce } from "../../helper/Utils";

function ProductModuleLayout() {
    const location = useLocation()
    const navigate = useNavigate()

    const { setIsContentLoading } = useOutletContext()
    const [searchText, setSearchText] = useState()
    // const [isSearchContentLoading, setIsSearchContentLoading] = useState(false)
    // const [searchedContentList, setSearchedContentList] = useState([])

    const serachtext = debounce((event) => {
        console.log(event);
        setSearchText(event)
    }, 500)

    const searchBarShow = () => {
        let show = true
        const keyvalue = (location.state === 'Sell/Share' && 'Sell/Share') || location.pathname
        switch (keyvalue) {
            case '/product/add':
                show = false
                break;
            case '/product/edit':
                show = false
                break;
            case '/product/product-detail':
                show = false
                break;
            case 'Sell/Share':
                show = false
                break;

            default:
                break;
        }
        return show
    }
    useEffect(() => {
        // if (searchText) {
        //     getProductListBySearchText(searchText)
        // }
    }, [searchText])
    return (
        <div className="inner-pages row border-top ">
            {searchBarShow() &&
                <Container fluid className="border-bottom mb-3">

                    <Container>
                        <Row className=" justify-content-center">
                            <InputGroup className="mb-0 bg-white p-2 rounded">
                                <AsyncTypeahead
                                    filterBy={() => true}
                                    id="async-example"
                                    // isLoading={isSearchContentLoading}
                                    labelKey="title"
                                    className="border-0 p-0 form-control rounded inner-search"
                                    minLength={3}
                                    onSearch={serachtext}
                                    // options={searchedContentList}
                                    placeholder="Search Books by Title, Author"
                                // renderMenuItemChildren={(option) => (
                                //     <span onClick={() => navigate('/product/product-detail', {
                                //         state: {
                                //             productId: option.id
                                //         }
                                //     })}>
                                //         <img
                                //             onError={replaceLogo}
                                //             alt={option.title}
                                //             src={MEDIA_URL + 'product/' + option.image}
                                //             style={{
                                //                 height: '24px',
                                //                 marginRight: '10px',
                                //                 width: '24px',
                                //             }}
                                //         />
                                //         <span>{option.title}</span>
                                //     </span>
                                // )}
                                />
                                <Button
                                    onClick={() => {
                                        if (!searchText || searchText === '') {
                                            return
                                        }
                                        navigate('/product?st=' + searchText)
                                    }}
                                    id="basic-addon2"
                                    className="ml-2 align-items-center d-flex">
                                    <Image
                                        src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}search-icon-white.svg`}
                                    />
                                </Button>
                                {/* <DropdownButton
                                align={'end'}
                                onSelect={(event) => console.log(event)}
                                bsPrefix="bg-transparent border border-1 ml-2 rounded px-3"
                                variant="" title="For Selling">
                                <Dropdown.Item eventKey={'selling'}>For Selling</Dropdown.Item>
                                <Dropdown.Item eventKey={'buying'}>For Buying</Dropdown.Item>

                            </DropdownButton> */}
                            </InputGroup>
                        </Row>
                    </Container>

                </Container>
            }


            <Container>
                <Outlet context={{ setIsContentLoading }} />
            </Container>


            {/* <Footer /> */}
        </div>
    )
}

export default ProductModuleLayout;