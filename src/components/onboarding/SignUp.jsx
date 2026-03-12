import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axios/axios-config";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import { useDispatch } from "react-redux";
import { closeSignupModal, openLoginModal } from "../../redux/authModalSlice";
import "../../styles/onboarding.scss";

const selectStyles = {
    control: (base, state) => ({
        ...base,
        background: state.isFocused ? '#fff' : '#f7f8fa',
        border: state.isFocused ? '1.5px solid #019D5F' : '1.5px solid transparent',
        borderRadius: '10px',
        minHeight: '44px',
        fontSize: '0.9rem',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(1, 157, 95, 0.08)' : 'none',
        transition: 'all 0.2s',
        '&:hover': {
            background: state.isFocused ? '#fff' : '#eef0f3',
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: '#b0b7c3',
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '0.875rem',
        background: state.isSelected ? '#019D5F' : state.isFocused ? 'rgba(1, 157, 95, 0.08)' : '#fff',
        color: state.isSelected ? '#fff' : '#2d3748',
        cursor: 'pointer',
        '&:active': {
            background: 'rgba(1, 157, 95, 0.15)',
        },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        border: '1px solid #eef0f3',
        zIndex: 9999,
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};

function SignUp({ signUpShowModal, setIsContentLoading }) {

    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        dispatch(closeSignupModal());
    }
    const [stateList, setStateList] = useState()
    const [cityList, setCityList] = useState()
    const [city, setCity] = useState()
    const [state, setState] = useState()
    const selectInputRef = useRef()
    const { register, handleSubmit, reset, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onChange' })

    const formSubmitHandler = (data) => {
        setIsSubmitting(true)
        setIsContentLoading(true)
        axiosInstance.post("auth/sign-up", data).then((res) => {
            if (res) {
                toast.success("Account created successfully!");
                handleClose()
                dispatch(openLoginModal())
                setIsContentLoading(false)
                setIsSubmitting(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
            setIsSubmitting(false)
        });
    }

    useEffect(() => {
        fetch('/cityState.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            setStateList(myJson)
        })
        register('state', { required: 'Please select state.' })
        register('city', { required: 'Please select city.' })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Modal
            backdrop="static"
            centered
            show={signUpShowModal}
            onHide={handleClose}
            dialogClassName="onboarding-modal signup-modal"
        >
            <div className="modal-accent" />

            <button
                onClick={() => { reset(); handleClose(); }}
                className="modal-close-btn"
                aria-label="Close"
            >
                <i className="bi bi-x-lg" />
            </button>

            <div className="onboarding-header">
                <div className="brand-icon">
                    <i className="bi bi-person-plus" style={{ color: '#019D5F' }} />
                </div>
                <h2>Create Account</h2>
                <p>Join Kitaab and start exploring</p>
            </div>

            <form autoComplete="off" onSubmit={handleSubmit(formSubmitHandler)}>
                <div className="onboarding-body">

                    {/* Name */}
                    <div className="ob-field">
                        <label className="ob-label">
                            Full Name <span className="required">*</span>
                        </label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-person ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.name ? 'has-error' : ''}`}
                                type="text"
                                autoComplete="name"
                                {...register('name', {
                                    required: 'Please enter your name.'
                                })}
                                placeholder="Enter your full name"
                                autoFocus
                            />
                        </div>
                        {errors?.name &&
                            <span className="ob-error">{errors.name.message}</span>
                        }
                    </div>

                    {/* Email & Phone */}
                    <div className="ob-row">
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">Email</label>
                                <div className="ob-input-wrapper">
                                    <i className="bi bi-envelope ob-input-icon" />
                                    <input
                                        className={`ob-input ${errors?.email ? 'has-error' : ''}`}
                                        type="text"
                                        autoComplete="email"
                                        {...register('email', {
                                            pattern: {
                                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                                message: "Enter a valid email",
                                            }
                                        })}
                                        placeholder="Email address"
                                    />
                                </div>
                                {errors?.email &&
                                    <span className="ob-error">{errors.email.message}</span>
                                }
                            </div>
                        </div>
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">
                                    Phone <span className="required">*</span>
                                </label>
                                <div className="ob-input-wrapper">
                                    <i className="bi bi-phone ob-input-icon" />
                                    <input
                                        className={`ob-input ${errors?.phone_number ? 'has-error' : ''}`}
                                        type="text"
                                        autoComplete="tel"
                                        {...register('phone_number', {
                                            required: "Phone number is required.",
                                            minLength: {
                                                value: 10,
                                                message: "Must be 10 digits.",
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: "Must be 10 digits.",
                                            },
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Must be 10 digits.",
                                            },
                                        })}
                                        placeholder="Phone number"
                                    />
                                </div>
                                {errors?.phone_number &&
                                    <span className="ob-error">{errors.phone_number.message}</span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="ob-field">
                        <label className="ob-label">
                            Password <span className="required">*</span>
                        </label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-lock ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.password ? 'has-error' : ''}`}
                                autoComplete="new-password"
                                {...register('password', {
                                    required: 'Please enter a password.',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters.'
                                    }
                                })}
                                placeholder="Minimum 8 characters"
                                type={showPassword ? 'text' : 'password'}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>
                        {errors?.password &&
                            <span className="ob-error">{errors.password.message}</span>
                        }
                    </div>

                    {/* Organization */}
                    <div className="ob-field">
                        <label className="ob-label">
                            Organization / School <span className="required">*</span>
                        </label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-building ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.organization ? 'has-error' : ''}`}
                                autoComplete="organization"
                                {...register('organization', {
                                    required: 'Please enter your organization.'
                                })}
                                type="text"
                                placeholder="Your school or organization"
                            />
                        </div>
                        {errors?.organization &&
                            <span className="ob-error">{errors.organization.message}</span>
                        }
                    </div>

                    {/* State & City */}
                    <div className="ob-row">
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">
                                    State <span className="required">*</span>
                                </label>
                                <Select
                                    options={stateList}
                                    value={state}
                                    name="state"
                                    styles={selectStyles}
                                    placeholder="Select state"
                                    menuPortalTarget={document.body}
                                    onChange={(e) => {
                                        setState(e)
                                        setValue('state', e.value)
                                        setCity(null)
                                        clearErrors('state')
                                        setValue('city', '')
                                        setCityList(e.cities)
                                    }}
                                />
                                {errors?.state &&
                                    <span className="ob-error">{errors.state.message}</span>
                                }
                            </div>
                        </div>
                        <div className="ob-col">
                            <div className="ob-field">
                                <label className="ob-label">
                                    City <span className="required">*</span>
                                </label>
                                <Select
                                    options={cityList}
                                    ref={selectInputRef}
                                    value={city}
                                    styles={selectStyles}
                                    placeholder="Select city"
                                    menuPortalTarget={document.body}
                                    onChange={(e) => {
                                        setCity(e)
                                        clearErrors('city')
                                        setValue('city', e.value)
                                    }}
                                />
                                {errors?.city &&
                                    <span className="ob-error">{errors.city.message}</span>
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        className="ob-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="btn-spinner" />
                        ) : (
                            <>Create Account</>
                        )}
                    </button>
                </div>
            </form>

            <div className="onboarding-footer">
                <p className="ob-switch-text">
                    Already have an account?
                    <Link
                        className="ob-switch-link"
                        onClick={() => {
                            dispatch(openLoginModal())
                            handleClose()
                        }}
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </Modal>
    )
}

export default SignUp;
