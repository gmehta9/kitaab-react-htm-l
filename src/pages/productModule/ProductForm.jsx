import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import Resizer from "react-image-file-resizer";

import Auth from "../../auth/Auth";
import { FileUploadhandler, MEDIA_URL, validateFile } from "../../helper/Utils";
import { axiosInstance } from "../../axios/axios-config";

function ProductForm() {
    const { setIsContentLoading } = useOutletContext()
    const loggedUser = Auth.loggedInUser()
    const location = useLocation();
    const navigate = useNavigate();

    const [imageView, setImageView] = useState()
    const [imageFile, setImageFile] = useState()
    const [years, setYears] = useState();
    const [categoriesList, setCategoriesList] = useState()

    const { register, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm({ mode: 'onChange' })

    const getCategoriesListHandler = (async (p) => {
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
                if (location?.state?.pId) {
                    getProductByIdHandler(location?.state?.pId)
                }
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                620,
                930,
                "JPEG",
                70,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file",
                620,
                930
            );
        });

    // const FileUploadhandler = async (file, uploadKeyName) => {

    //     const formData = new FormData()

    //     formData.append('type', uploadKeyName)
    //     formData.append('file', file)

    //     return axios.post(apiUrl + 'upload-image', formData).then((res) => {
    //         console.log(res);
    //         return res.data.image
    //         // upload_profile_image
    //     }).catch((error) => {
    //         setIsContentLoading(false)
    //     });
    // }

    const productFormHandler = async (data) => {
        setIsContentLoading(true)

        if (!Auth.isUserAuthenticated()) {
            toast.error('Need login to add product.')
            return
        }
        let body = data
        let api = "product"
        if (imageFile) {
            const responseImg = await FileUploadhandler(imageFile, 'product')
            if (!responseImg) {
                return
            }
            body = { ...data, image: responseImg }
        }

        delete body['file'];

        let method = 'post'
        if (location?.state?.pId) {
            method = 'put'
            body.is_approved = 0
            api = api + '/' + location?.state?.pId
        }

        axiosInstance[method](api, body).then((res) => {
            if (res) {
                toast.success("Product added successfully!");
                setIsContentLoading(false)
                navigate(-1)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    const getProductByIdHandler = (async (id) => {
        setIsContentLoading(true)

        let APIUrl = 'product/' + id

        axiosInstance.get(`${APIUrl}`).then((response) => {
            if (response) {
                setValue('title', response?.data?.title)
                setValue('category_id', response?.data?.category_id)
                setValue('sale_price', removeDecimal(response?.data?.sale_price))
                setValue('price', removeDecimal(response?.data?.price))
                setValue('auther', response?.data?.auther)
                setValue('transact_type', response?.data?.transact_type)
                setValue('year_of_publication', response?.data?.year_of_publication)
                setValue('short_description', response?.data?.short_description)
                setValue('description', response?.data?.description)
                // \image
                if (response?.data?.image) {
                    setImageView(MEDIA_URL + 'product/' + response?.data?.image)
                }
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });
    function removeDecimal(num) {
        if (num) {
            return num.toString().replace(/\.00$/, "");
        }
        return num
    }


    useEffect(() => {
        register('short_description', { required: 'Field is required.' });
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 35 }, (_, index) => (currentYear - index).toString());
        setYears(years)
        getCategoriesListHandler(1)
        setValue('category_id', '')
        if (!Auth.isUserAuthenticated()) {
            navigate('/')
        }
        setValue('city', loggedUser?.city)
        setValue('state', loggedUser?.state)
        document.title = `${location?.state?.pId ? 'Edit' : 'Add'} Book | Kitaab Juction'`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const imageChangeHandler = async (file) => {

        if (!validateFile(file[0], [])) {
            return;
        }
        const image = await resizeFile(file[0]);
        setImageFile(image)
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            setImageView(imageUrl)
        };
        reader.readAsDataURL(image);
    }
    // const responseImg = await FileUploadhandler(image, 'product')
    // console.log(responseImg);



    useEffect(() => {

        if (getValues('file')) {

            const file = getValues('file')
            if (file.length > 0) {

                imageChangeHandler(file)
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('file'), getValues, setValue])

    return (
        <>
            <h2 className="mt-5 mb-4">
                <span
                    onClick={() => navigate(-1)}
                    className="mr-2 btn p-0">
                    <i className='bx bx-arrow-back '></i>
                </span>
                {location?.state?.pId ? 'Edit' : 'Add'} Book</h2>
            <form className="mb-4" onSubmit={handleSubmit(productFormHandler)}>
                <Row>
                    <Col lg={8}>

                        <div className="form-group mb-3">
                            <label
                                htmlFor="productTitle">Product Title <sup className="text-danger small">*</sup></label>
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
                                    <option key={index + 'cat'} value={cat.id}>{cat?.name}</option>
                                )}

                            </select>
                        </div>

                        <Row>

                            <Col lg={6} className="mb-2">
                                <div className="form-group mb-3">
                                    <label htmlFor="priceInput">Price<sup className="text-danger small">*</sup></label>
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
                                            },
                                            validate: (val) => {
                                                if (+watch("price") <= +val) {
                                                    return "Sale price should not be lower then price.";
                                                }
                                            },
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
                                    <label htmlFor="auther">Author <sup className="text-danger small">*</sup></label>
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
                                    <label htmlFor="year_of_publication">Year of Publication <sup className="text-danger small">*</sup></label>
                                    <select
                                        {...register('year_of_publication', {
                                            required: 'Field is required.'
                                        })}
                                        className="form-control"
                                        id="year_of_publication">
                                        <option value="">Select Year of Publication</option>
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
                                type="file"
                                accept="image/jpg,image/png,image/*"
                                className="d-none"
                                id="imageUpload" />
                            <label htmlFor="imageUpload" className="product-upload-frame my-2 position-relative">

                                {imageView ?
                                    <img src={`${imageView}`} className="image-preview" alt="" />
                                    :
                                    <span className="placeholder bg-transparent">
                                        <img src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}upload-placeholder.png`} className="opacity-50" alt="" />
                                    </span>
                                }
                                {/* <span className="placeholder bg-transparent d-block">
                                    <img src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}upload-placeholder.png`} alt="" />
                                </span> */}
                                {/* <img src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}book.webp`} alt="" /> */}

                            </label>
                        </div>
                    </Col>
                    <Col lg={12} className="mb-2">
                        <div className="form-group mb-3">
                            <label htmlFor="short_description">Short Description<sup className="text-danger small">*</sup></label>
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
                <button type="submit" className="btn btn-primary">
                    {location?.state?.pId ? 'Update' : 'Submit'} </button>
            </form>
        </>
    )
}

export default ProductForm;
