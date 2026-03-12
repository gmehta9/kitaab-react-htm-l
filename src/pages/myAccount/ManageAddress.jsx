import { useEffect, useState, useCallback, useRef } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../../styles/onboarding.scss';

function ManageAddress({ setAddressModalShow, addressModalShow, setCartData, setCartBtnClick, cartData, setIsContentLoading }) {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({ mode: 'onChange' });
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    // Refs
    const isMounted = useRef(true);
    const initialLoadDone = useRef(false);

    // Watch shipping state
    const watchedShippingState = watch('shipping_state');

    const handleClose = useCallback(() => {
        setAddressModalShow(false);
    }, [setAddressModalShow]);

    // Order handler
    const orderPlacesHandler = useCallback(async (data) => {
        const readyItems = cartData.filter(cd => cd.isReadyForOrder);
        // Use cart document _id if available, otherwise fall back to product id
        const order = readyItems
            .map(item => item._id || item.id)
            .filter(Boolean);

        if (!order || order.length === 0) {
            toast.error("No order Selected in cart!", { duration: 2000 });
            return;
        }

        // Remove empty optional fields so backend validation doesn't reject them
        const payload = {
            ...data,
            shipping_price: getValues('shipping_order_type') === 'self_pickup' ? '20' : '40',
            cart_ids: order
        };

        // Strip empty strings — backend rejects empty optional fields
        Object.keys(payload).forEach(key => {
            if (payload[key] === '') {
                delete payload[key];
            }
        });

        setIsContentLoading(true);
        try {
            const res = await axiosInstance.post('order', payload);

            if (res && isMounted.current) {
                toast.success("Order Placed successfully, Please check your email.", { duration: 5000 });
                setCartBtnClick(prev => prev + 10);
                setCartData(cartData.filter(cd => !cd.isReadyForOrder).map(item => ({
                    product_id: item.product_id,
                    quantity: 1
                })));
                handleClose();
                navigate('/account/order-history');
            }
        } catch (error) {
            console.error('Order placement failed');
        } finally {
            if (isMounted.current) {
                setIsContentLoading(false);
            }
        }
    }, [cartData, getValues, handleClose, navigate, setCartBtnClick, setCartData, setIsContentLoading]);

    // Profile address handler
    const loadProfileAddress = useCallback(async (stateListData) => {
        try {
            const response = await axiosInstance.get('auth/profile');
            if (response && isMounted.current) {
                const user = response?.data;

                // Find cities for user's state
                const stateData = stateListData.find(s => s.value === user?.state);
                if (stateData) {
                    setCityList(stateData.cities || []);
                }

                setValue('shipping_name', user?.name);
                setValue('shipping_phone_no', user?.phone_number);
                setValue('shipping_email', user?.email);
                setValue('shipping_city', user?.city);
                setValue('shipping_state', user?.state);
                setValue('shipping_address', user?.address);
                setValue('shipping_pin_code', user?.pin_code);
            }
        } catch (error) {
            console.error('Failed to load profile');
        }
    }, [setValue]);

    // Initial load
    useEffect(() => {
        isMounted.current = true;

        if (!initialLoadDone.current) {
            initialLoadDone.current = true;

            fetch('/cityState.json', {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
                .then(res => res.json())
                .then(data => {
                    if (isMounted.current) {
                        setStateList(data || []);
                        if (Auth.isUserAuthenticated()) {
                            loadProfileAddress(data || []);
                        }
                    }
                })
                .catch(() => { });
        }

        return () => {
            isMounted.current = false;
        };
    }, [loadProfileAddress]);

    // Update city list when state changes
    useEffect(() => {
        if (watchedShippingState && stateList.length > 0) {
            const stateData = stateList.find(s => s.value === watchedShippingState);
            if (stateData) {
                setCityList(stateData.cities || []);
            }
        }
    }, [watchedShippingState, stateList]);

    return (
        <Modal
            size="lg"
            show={addressModalShow}
            onHide={handleClose}
            dialogClassName="onboarding-modal signup-modal"
            centered>
            <div className="modal-accent" />

            <button
                type="button"
                onClick={handleClose}
                className="modal-close-btn"
                aria-label="Close">
                <i className="bi bi-x-lg" />
            </button>

            <div className="onboarding-header">
                <div className="brand-icon">
                    <i className="bi bi-truck" style={{ color: '#019D5F' }} />
                </div>
                <h2>Shipping Address</h2>
                <p>Confirm your delivery details to place the order</p>
            </div>

            <form autoComplete="off" onSubmit={handleSubmit(orderPlacesHandler)}>
                <div className="onboarding-body">

                    {/* Delivery info banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(1,157,95,0.06) 0%, rgba(1,157,95,0.02) 100%)',
                        border: '1px solid rgba(1,157,95,0.15)',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        marginBottom: '1.5rem',
                        fontSize: '0.8rem',
                        color: '#495057'
                    }}>
                        <div style={{ fontWeight: 600, marginBottom: '6px', color: '#1a1a2e' }}>
                            <i className="bi bi-info-circle me-1" style={{ color: '#019D5F' }} /> Delivery Information
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px' }}>
                            <li>Delivery charge: <strong>Rs. 20/book</strong> (buying)</li>
                            <li>Delivery charge: <strong>Rs. 40/book</strong> (borrowing)</li>
                        </ul>
                        <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#6b7280' }}>
                            Book will be delivered at the security gate of your organization/school.
                        </div>
                    </div>

                    <input type="hidden" value="paid_delivery" {...register('shipping_order_type')} />

                    {/* Name */}
                    <div className="ob-field">
                        <label className="ob-label">Name <span className="required">*</span></label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-person ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.shipping_name ? 'has-error' : ''}`}
                                type="text"
                                autoComplete="off"
                                {...register('shipping_name', { required: 'Please enter your name.' })}
                                placeholder="Enter your name"
                            />
                        </div>
                        {errors?.shipping_name &&
                            <span className="ob-error">{errors.shipping_name.message}</span>
                        }
                    </div>

                    {/* Email & Phone */}
                    <div className="ob-row">
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">Email <span className="required">*</span></label>
                                <div className="ob-input-wrapper">
                                    <i className="bi bi-envelope ob-input-icon" />
                                    <input
                                        className={`ob-input ${errors?.shipping_email ? 'has-error' : ''}`}
                                        type="text"
                                        autoComplete="off"
                                        {...register('shipping_email', { required: 'Please enter your email.' })}
                                        placeholder="Email address"
                                    />
                                </div>
                                {errors?.shipping_email &&
                                    <span className="ob-error">{errors.shipping_email.message}</span>
                                }
                            </div>
                        </div>
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">Phone <span className="required">*</span></label>
                                <div className="ob-input-wrapper">
                                    <i className="bi bi-phone ob-input-icon" />
                                    <input
                                        className={`ob-input ${errors?.shipping_phone_no ? 'has-error' : ''}`}
                                        type="text"
                                        autoComplete="off"
                                        {...register('shipping_phone_no', { required: 'Please enter your phone.' })}
                                        placeholder="Phone number"
                                    />
                                </div>
                                {errors?.shipping_phone_no &&
                                    <span className="ob-error">{errors.shipping_phone_no.message}</span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="ob-field">
                        <label className="ob-label">Organization / School <span className="required">*</span></label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-building ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.shipping_address ? 'has-error' : ''}`}
                                type="text"
                                autoComplete="off"
                                {...register('shipping_address', { required: 'Please enter your address.' })}
                                placeholder="Your organization or school"
                            />
                        </div>
                        {errors?.shipping_address &&
                            <span className="ob-error">{errors.shipping_address.message}</span>
                        }
                    </div>

                    {/* State, City, Pin Code */}
                    <div className="ob-row">
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">State <span className="required">*</span></label>
                                <div className="ob-input-wrapper">
                                    <i className="bi bi-geo-alt ob-input-icon" />
                                    <select
                                        className={`ob-input ${errors?.shipping_state ? 'has-error' : ''}`}
                                        {...register('shipping_state', { required: 'Please select state.' })}>
                                        <option value="">Select State</option>
                                        {stateList.map((state) => (
                                            <option key={state.value} value={state.value}>{state.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors?.shipping_state &&
                                    <span className="ob-error">{errors.shipping_state.message}</span>
                                }
                            </div>
                        </div>
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">City <span className="required">*</span></label>
                                <div className="ob-input-wrapper">
                                    <i className="bi bi-pin-map ob-input-icon" />
                                    <select
                                        className={`ob-input ${errors?.shipping_city ? 'has-error' : ''}`}
                                        {...register('shipping_city', { required: 'Please select city.' })}>
                                        <option value="">Select City</option>
                                        {cityList.map((city) => (
                                            <option key={city.value} value={city.value}>{city.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors?.shipping_city &&
                                    <span className="ob-error">{errors.shipping_city.message}</span>
                                }
                            </div>
                        </div>
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">Pin Code</label>
                                <div className="ob-input-wrapper">
                                    <i className="bi bi-mailbox ob-input-icon" />
                                    <input
                                        className={`ob-input ${errors?.shipping_pin_code ? 'has-error' : ''}`}
                                        type="text"
                                        autoComplete="off"
                                        inputMode="numeric"
                                        {...register('shipping_pin_code', {
                                            maxLength: { value: 6, message: 'Enter a valid pin code' },
                                            pattern: { value: /^\d+$/, message: 'Invalid pin code.' }
                                        })}
                                        placeholder="Pin code (optional)"
                                    />
                                </div>
                                {errors?.shipping_pin_code &&
                                    <span className="ob-error">{errors.shipping_pin_code.message}</span>
                                }
                            </div>
                        </div>
                    </div>

                    <button className="ob-submit-btn" type="submit">
                        <i className="bi bi-bag-check me-1" /> Place Your Order
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ManageAddress;
