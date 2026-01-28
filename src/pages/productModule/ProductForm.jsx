import { useEffect, useState, useCallback, useMemo, useRef, memo, lazy, Suspense } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import 'react-quill/dist/quill.snow.css';
import { useForm, Controller } from "react-hook-form";
import { Col, Row, Spinner, Card } from "react-bootstrap";
import Resizer from "react-image-file-resizer";

import Auth from "../../auth/Auth";
import { FileUploadhandler, MEDIA_URL, validateFile } from "../../helper/Utils";
import { axiosInstance } from "../../axios/axios-config";

const ReactQuill = lazy(() => import("react-quill"));

// Memoized QuillEditor to prevent unnecessary re-renders
const QuillEditor = memo(({ value, onChange, placeholder }) => (
    <Suspense fallback={<div className="quill-loader">Loading editor...</div>}>
        <ReactQuill
            className="product-quill-editor"
            theme="snow"
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            modules={{
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                ]
            }}
        />
    </Suspense>
));

// Generate years array once (static data)
const currentYear = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: 35 }, (_, i) => (currentYear - i).toString());

// Memoized Image Upload Component
const ImageUploader = memo(({ imageView, imageUploading, onFileChange, inputRef }) => (
    <div className="image-upload-container">
        <input
            ref={inputRef}
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp"
            className="d-none"
            id="imageUpload"
            onChange={onFileChange}
        />
        <label htmlFor="imageUpload" className="image-upload-label">
            {imageUploading ? (
                <div className="upload-loading">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <span>Processing...</span>
                </div>
            ) : imageView ? (
                <div className="image-preview-wrapper">
                    <img src={imageView} alt="Product preview" />
                    <div className="image-overlay">
                        <i className='bx bx-camera'></i>
                        <span>Change</span>
                    </div>
                </div>
            ) : (
                <div className="upload-placeholder">
                    <i className='bx bx-cloud-upload'></i>
                    <span>Upload Cover</span>
                    <small>JPG, PNG, WebP</small>
                </div>
            )}
        </label>
    </div>
));

// Memoized Form Input Component
const FormInput = memo(({ label, required, error, children }) => (
    <div className="form-field">
        <label className="form-field-label">
            {label}
            {required && <span className="required-mark">*</span>}
        </label>
        {children}
        {error && <span className="field-error">{error}</span>}
    </div>
));

function ProductForm() {
    const { setIsContentLoading } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const isEditMode = Boolean(location?.state?.pId);

    // Get logged user once
    const loggedUser = useMemo(() => Auth.loggedInUser(), []);

    const [imageView, setImageView] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
        reset
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            title: '',
            category_id: '',
            price: '',
            sale_price: '',
            auther: '',
            transact_type: '',
            year_of_publication: '',
            short_description: '',
            description: ''
        }
    });

    // Memoized resize function
    const resizeFile = useCallback((file) =>
        new Promise((resolve, reject) => {
            Resizer.imageFileResizer(
                file, 620, 930, "JPEG", 70, 0,
                (uri) => resolve(uri),
                "file", 620, 930
            );
        }), []);

    // Image change handler
    const handleImageChange = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!validateFile(file, [])) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setImageUploading(true);
        try {
            const resizedImage = await resizeFile(file);
            setImageFile(resizedImage);

            const reader = new FileReader();
            reader.onload = (event) => {
                setImageView(event.target.result);
                setImageUploading(false);
            };
            reader.readAsDataURL(resizedImage);
        } catch (error) {
            setImageUploading(false);
            toast.error("Failed to process image.");
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [resizeFile]);

    // Load categories
    const loadCategories = useCallback(async () => {
        try {
            const response = await axiosInstance.get('category?page=1&size=50');
            setCategoriesList(response?.data?.data || []);
        } catch (error) {
            console.error('Failed to load categories');
        }
    }, []);

    // Load product for edit
    const loadProduct = useCallback(async (id) => {
        setIsContentLoading(true);
        try {
            const response = await axiosInstance.get(`product/${id}`);
            const data = response?.data;
            if (data) {
                reset({
                    title: data.title || '',
                    category_id: data.category_id || '',
                    price: data.price?.toString().replace(/\.00$/, '') || '',
                    sale_price: data.sale_price?.toString().replace(/\.00$/, '') || '',
                    auther: data.auther || '',
                    transact_type: data.transact_type || '',
                    year_of_publication: data.year_of_publication || '',
                    short_description: data.short_description || '',
                    description: data.description || ''
                });
                if (data.image) {
                    setImageView(MEDIA_URL + 'product/' + data.image);
                }
            }
        } catch (error) {
            toast.error("Failed to load product.");
        } finally {
            setIsContentLoading(false);
        }
    }, [reset, setIsContentLoading]);

    // Form submit handler
    const onSubmit = useCallback(async (data) => {
        if (!Auth.isUserAuthenticated()) {
            toast.error('Please login to continue.');
            return;
        }

        if (!data.short_description || data.short_description === '<p><br></p>') {
            toast.error('Short description is required.');
            return;
        }

        setIsSubmitting(true);
        setIsContentLoading(true);

        try {
            let body = { ...data };

            if (imageFile) {
                const uploadedImage = await FileUploadhandler(imageFile, 'product');
                if (!uploadedImage) {
                    setIsSubmitting(false);
                    setIsContentLoading(false);
                    return;
                }
                body.image = uploadedImage;
            }

            const api = isEditMode ? `product/${location.state.pId}` : 'product';
            const method = isEditMode ? 'put' : 'post';

            if (isEditMode) {
                body.is_approved = 0;
            }

            await axiosInstance[method](api, body);
            toast.success(isEditMode ? "Book updated!" : "Book added!");
            navigate(-1);
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
            setIsContentLoading(false);
        }
    }, [imageFile, isEditMode, location?.state?.pId, navigate, setIsContentLoading]);

    // Initial load
    useEffect(() => {
        if (!Auth.isUserAuthenticated()) {
            navigate('/');
            return;
        }

        document.title = `${isEditMode ? 'Edit' : 'Add'} Book | Kitaab Junction`;
        setValue('city', loggedUser?.city);
        setValue('state', loggedUser?.state);

        loadCategories().then(() => {
            if (isEditMode) {
                loadProduct(location.state.pId);
            }
        });
    }, [isEditMode, loadCategories, loadProduct, location?.state?.pId, loggedUser, navigate, setValue]);

    return (
        <div className="product-form-page">
            <div className="page-header">
                <button type="button" onClick={() => navigate(-1)} className="back-btn">
                    <i className='bx bx-arrow-back'></i>
                </button>
                <h1>{isEditMode ? 'Edit' : 'Add'} Book</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="product-form">
                <Row>
                    {/* Left Column - Image */}
                    <Col lg={3} md={4} className="mb-4">
                        <Card className="upload-card">
                            <Card.Body>
                                <ImageUploader
                                    imageView={imageView}
                                    imageUploading={imageUploading}
                                    onFileChange={handleImageChange}
                                    inputRef={fileInputRef}
                                />
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Column - Form Fields */}
                    <Col lg={9} md={8}>
                        <Card className="form-card">
                            <Card.Body>
                                {/* Basic Info Section */}
                                <div className="form-section">
                                    <h6 className="section-title">Basic Information</h6>
                                    <Row>
                                        <Col md={8}>
                                            <FormInput label="Book Title" required error={errors?.title?.message}>
                                                <input
                                                    type="text"
                                                    className={`form-input ${errors?.title ? 'error' : ''}`}
                                                    placeholder="Enter book title"
                                                    {...register('title', { required: 'Title is required' })}
                                                />
                                            </FormInput>
                                        </Col>
                                        <Col md={4}>
                                            <FormInput label="Category">
                                                <select className="form-input" {...register('category_id')}>
                                                    <option value="">Select category</option>
                                                    {categoriesList.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </FormInput>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormInput label="Author" required error={errors?.auther?.message}>
                                                <input
                                                    type="text"
                                                    className={`form-input ${errors?.auther ? 'error' : ''}`}
                                                    placeholder="Enter author name"
                                                    {...register('auther', { required: 'Author is required' })}
                                                />
                                            </FormInput>
                                        </Col>
                                        <Col md={6}>
                                            <FormInput label="Year of Publication" required error={errors?.year_of_publication?.message}>
                                                <select
                                                    className={`form-input ${errors?.year_of_publication ? 'error' : ''}`}
                                                    {...register('year_of_publication', { required: 'Year is required' })}
                                                >
                                                    <option value="">Select year</option>
                                                    {YEARS_LIST.map((year) => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </FormInput>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Pricing Section */}
                                <div className="form-section">
                                    <h6 className="section-title">Pricing & Type</h6>
                                    <Row>
                                        <Col md={4}>
                                            <FormInput label="Transaction Type" required error={errors?.transact_type?.message}>
                                                <select
                                                    className={`form-input ${errors?.transact_type ? 'error' : ''}`}
                                                    {...register('transact_type', { required: 'Type is required' })}
                                                >
                                                    <option value="">Select type</option>
                                                    <option value="sell">Sell</option>
                                                    <option value="sharing for 60 days">Share (60 days)</option>
                                                </select>
                                            </FormInput>
                                        </Col>
                                        <Col md={4}>
                                            <FormInput label="Price (₹)" required error={errors?.price?.message}>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className={`form-input ${errors?.price ? 'error' : ''}`}
                                                    placeholder="0"
                                                    {...register('price', {
                                                        required: 'Price is required',
                                                        min: { value: 0, message: 'Invalid price' }
                                                    })}
                                                />
                                            </FormInput>
                                        </Col>
                                        <Col md={4}>
                                            <FormInput label="Sale Price (₹)" error={errors?.sale_price?.message}>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className={`form-input ${errors?.sale_price ? 'error' : ''}`}
                                                    placeholder="Optional"
                                                    {...register('sale_price')}
                                                />
                                            </FormInput>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Description Section */}
                                <div className="form-section">
                                    <h6 className="section-title">Description</h6>
                                    <Row>
                                        <Col md={12}>
                                            <FormInput label="Short Description" required>
                                                <Controller
                                                    name="short_description"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <QuillEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Brief description of the book..."
                                                        />
                                                    )}
                                                />
                                            </FormInput>
                                        </Col>
                                        <Col md={12}>
                                            <FormInput label="Full Description">
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <QuillEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Detailed description..."
                                                        />
                                                    )}
                                                />
                                            </FormInput>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Submit Button */}
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>{isEditMode ? 'Update' : 'Publish'} Book</>
                                        )}
                                    </button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </form>
        </div>
    );
}

export default memo(ProductForm);
