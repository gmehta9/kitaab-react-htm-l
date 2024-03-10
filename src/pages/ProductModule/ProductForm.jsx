import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { axiosInstance, headers } from "../../axios/axios-config";
import toast from "react-hot-toast";
import Auth from "../../auth/Auth";
import { useOutletContext } from "react-router-dom";

function ProductForm() {
    const [years, setYears] = useState();
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm({ mode: 'onChange' })
    const { setIsContentLoading } = useOutletContext()
    const [categoriesList, setCategoriesList] = useState()

    const getCategoriesListHandler = (async (p) => {
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
    });

    const FileUploadhandler = async (file, uploadKeyName) => {

        const formData = new FormData()

        formData.append('type', uploadKeyName)
        formData.append('file', file)

        return axiosInstance.post('upload-image', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${Auth.token()}`
            },
        }).then((res) => {
            return res
            // upload_profile_image
        }).catch((error) => {

        });
    }

    const productFormHandler = async (data) => {
        setIsContentLoading(true)

        if (!Auth.isUserAuthenticated()) {
            toast.error('Need login to add product.')
            return
        }

        const responseImg = await FileUploadhandler(data.file[0], 'product')
        if (!responseImg) {
            return
        }

        const body = { ...data, images: responseImg.image }
        delete body['file'];

        axiosInstance.post("product", body, {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                toast.success("Product added successfully!");
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    useEffect(() => {
        register('short_description', { required: 'Field is required.' });
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 35 }, (_, index) => (currentYear - index).toString());
        setYears(years)
        getCategoriesListHandler()
        setValue('category_id', '')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <h2 className="mt-5 mb-4">Product Add</h2>
            <form className="mb-4" onSubmit={handleSubmit(productFormHandler)}>
                <Row>
                    <Col lg={8}>

                        <div className="form-group mb-3">
                            <label
                                htmlFor="productTitle">Product Title <span className="text-danger small">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                id="productTitle"
                                {...register('title', {
                                    required: 'Field is required.'
                                })}
                                aria-describedby="productTitle"
                            />
                            {errors?.title &&
                                <span className="text-danger small position-absolute">
                                    {errors?.title?.message}
                                </span>
                            }
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="exampleInputEmail1">Category </label>

                            <select
                                // name="category_id"
                                {...register('category_id')}
                                className="form-control">
                                <option value="" disabled>Select Product</option>
                                {categoriesList && categoriesList.map((cat, index) =>
                                    <option key={index + 'cat'} value={cat.id}>{cat.name}</option>
                                )}

                            </select>
                        </div>

                        <Row>

                            <Col lg={6} className="mb-2">
                                <div className="form-group mb-3">
                                    <label htmlFor="priceInput">Price<span className="text-danger small">*</span></label>
                                    <input
                                        {...register('price', {
                                            required: 'Field is required.',
                                            pattern: {
                                                value: /^(0|[1-9][0-9]*)$/,
                                                message: ''
                                            }
                                        })}
                                        min={0}
                                        type="number"
                                        className="form-control"
                                        id="priceInput"
                                        aria-describedby="priceInput" />
                                    {errors?.price &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.price?.message}
                                        </span>
                                    }
                                </div>
                            </Col>

                            <Col lg={6} className="mb-2">
                                <div className="form-group mb-3">
                                    <label htmlFor="salePriceInput">Sale Price</label>
                                    <input
                                        {...register('sale_price', {
                                            pattern: {
                                                value: /^(0|[1-9][0-9]*)$/,
                                                message: ''
                                            }
                                        })}
                                        min={0}
                                        type="number"
                                        className="form-control"
                                        id="salePriceInput"
                                        aria-describedby="salePriceInput" />
                                    {errors?.sale_price &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.sale_price?.message}
                                        </span>
                                    }
                                </div>
                            </Col>

                            <Col lg={12} className="mb-2">
                                <div className="form-group mb-3">
                                    <label htmlFor="auther">Author <span className="text-danger small">*</span></label>
                                    <input
                                        {...register('auther', {
                                            required: 'Field is required.'
                                        })}
                                        type="text"
                                        className="form-control"
                                        id="auther"
                                        aria-describedby="AuthorInput" />
                                    {errors?.auther &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.auther?.message}
                                        </span>
                                    }
                                </div>
                            </Col>
                            <Col lg={6} className="mb-2">
                                <div className="form-group mb-3">
                                    <label htmlFor="transact_type">Transact Type </label>
                                    <select
                                        {...register('transact_type', {
                                            required: 'Field is required.'
                                        })}
                                        className="form-control"
                                        id="transact_type">
                                        <option value="">Select Transact Type</option>
                                        <option value="sell">Sell</option>
                                        <option value="sharing for 60 days">Sharing for 60 days</option>
                                    </select>
                                    {errors?.transact_type &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.transact_type?.message}
                                        </span>
                                    }
                                </div>
                            </Col>
                            <Col lg={6} className="mb-2">
                                <div className="form-group mb-3">
                                    <label htmlFor="year_of_publication">Year of Publication <span className="text-danger small">*</span></label>
                                    <select
                                        {...register('year_of_publication', {
                                            required: 'Field is required.'
                                        })}
                                        className="form-control"
                                        id="year_of_publication">
                                        {years?.map((y, index) =>
                                            <option value={y} key={index + 'y'}>{y}</option>
                                        )}

                                    </select>
                                    {errors?.year_of_publication &&
                                        <span className="text-danger small position-absolute">
                                            {errors?.year_of_publication?.message}
                                        </span>
                                    }
                                </div>
                            </Col>



                        </Row>
                    </Col>

                    <Col lg={4} className="mb-3">
                        <div className="form-group mb-4 d-flex flex-column">
                            <label>Product Image</label>

                            <input
                                {...register('file')}
                                type="file" className="d-none" id="imageUpload" />
                            <label htmlFor="imageUpload" className="product-upload-frame my-2 position-relative">
                                <span className="placeholder bg-transparent d-block">
                                    <img src="./assets/images/upload-placeholder.png" alt="" />
                                </span>
                                {/* <img src="./assets/images/book.webp" alt="" /> */}

                            </label>
                        </div>
                    </Col>
                    <Col lg={12} className="mb-2">
                        <div className="form-group mb-3">
                            <label htmlFor="short_description">Short Description<span className="text-danger small">*</span></label>
                            <ReactQuill
                                className="edit-class"
                                theme="snow"
                                value={getValues('short_description')}
                                onChange={(data) => setValue("short_description", data)}
                            />
                            {errors?.short_description &&
                                <span className="text-danger small position-absolute">
                                    {errors?.short_description?.message}
                                </span>
                            }
                        </div>
                    </Col>
                    <Col lg={12} className="col-md-12 mb-3">
                        <div className="form-group mb-3">
                            <label htmlFor="description">Description</label>
                            <ReactQuill
                                className="edit-class"
                                theme="snow"
                                value={getValues('description')}
                                onChange={(data) => setValue("description", data)}
                            />
                            {errors?.description &&
                                <span className="text-danger small position-absolute">
                                    {errors?.description?.message}
                                </span>
                            }
                        </div>
                    </Col>

                </Row>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default ProductForm;
