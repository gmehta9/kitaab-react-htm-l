import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

function ProductForm() {
    const [years, setYears] = useState();
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 20 }, (_, index) => (currentYear - index).toString());
        setYears(years)
        console.log(years);
    }, [])
    return (
        <>
            <h2 className="mt-5 mb-4">Product Add</h2>
            <form className="mb-4">
                <Row>
                    <Col lg={6}>

                        <div className="form-group mb-3">
                            <label htmlFor="productTitle">Product Title <span className="text-danger small">*</span></label>
                            <input type="text" className="form-control" id="productTitle" aria-describedby="productTitle" />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputEmail1">Category </label>
                            <select className="form-control">
                                <option value="option1">Category 1</option>
                                <option value="option2">Category 2</option>
                                <option value="option3">Category 3</option>
                            </select>
                        </div>

                        <Row>

                            <Col lg={4} className="col-md-6">
                                <div className="form-group mb-3">
                                    <label htmlFor="priceInput">Price<span className="text-danger small">*</span></label>
                                    <input type="number" className="form-control" id="priceInput" aria-describedby="priceInput" />
                                </div>
                            </Col>

                            <Col lg={4}>
                                <div className="form-group mb-3">
                                    <label htmlFor="salePriceInput">Sale Price</label>
                                    <input type="number" className="form-control" id="salePriceInput" aria-describedby="salePriceInput" />
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="form-group mb-3">
                                    <label htmlFor="AuthorInput">Author <span className="text-danger small">*</span></label>
                                    <input type="text" className="form-control" id="AuthorInput" aria-describedby="AuthorInput" />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="form-group mb-3">
                                    <label htmlFor="transactType">Transact Type </label>
                                    <select className="form-control" id="transactType">
                                        <option value="Sharing">Sell</option>
                                        <option value="sharing">Sharing for 60 days</option>
                                    </select>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="form-group mb-3">
                                    <label htmlFor="yearofPublication">Year of Publication <span className="text-danger small">*</span></label>
                                    <select className="form-control" id="yearofPublication">
                                        {years?.map((y, index) =>
                                            <option value={y} key={index + 'y'}>{y}</option>
                                        )}

                                    </select>
                                </div>
                            </Col>

                            <Col lg={12}>
                                <div className="form-group mb-3">
                                    <label htmlFor="short_description">Short Description<span className="text-danger small">*</span></label>
                                    <textarea
                                        className="form-control"
                                        name="short_description"
                                        id="short_description"></textarea>
                                </div>
                            </Col>

                        </Row>
                    </Col>

                    <Col lg={6} className=" mb-3">
                        <div className="form-group mb-4 d-flex flex-column">
                            <label>Product Image</label>

                            <input type="file" className="d-none" id="imageUpload" />
                            <label htmlFor="imageUpload" className="product-upload-frame my-2 position-relative">
                                <span className="placeholder bg-transparent d-block">
                                    <img src="./assets/images/upload-placeholder.png" alt="" />
                                </span>
                                {/* <img src="./assets/images/book.webp" alt="" /> */}

                            </label>
                        </div>
                    </Col>
                    <Col lg={12} className="col-md-12 mb-3">
                        <div className="form-group mb-3">
                            <label htmlFor="description">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                id="description"></textarea>
                        </div>
                    </Col>

                </Row>



                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default ProductForm;
