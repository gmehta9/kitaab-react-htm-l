import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import Auth from "../../auth/Auth";
import { axiosInstance } from "../../axios/axios-config";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeLoginModal, closeSignupModal, openSignupModal } from "../../redux/authModalSlice";
import "../../styles/onboarding.scss";


function Login({ setIsUserLoggedIn, setIsContentLoading }) {

    const [forgotShowModal, setForgotShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSignupModalOpen = useSelector(state => state.authModal.signupModalOpen);
    const isSignINModalOpen = useSelector(state => state.authModal.loginModalOpen);

    const dispatch = useDispatch();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' })

    const handleClose = (type) => {
        switch (type) {
            case 'login':
                dispatch(closeLoginModal())
                break;
            case 'signup':
                dispatch(closeSignupModal())
                break;
            default:
                break;
        }
    }

    const formSubmitHandler = (data) => {
        setIsSubmitting(true)
        setIsContentLoading(true)
        axiosInstance.post("auth/sign-in", {
            ...data,
            type: 'Buyer/Seller'
        }
        ).then((res) => {
            if (res) {
                toast.success("Login Successfully!");
                setIsContentLoading(false)
                setIsSubmitting(false)
                Auth.login({ user: res.user, token: res.token }, true)
                setIsUserLoggedIn(true)
                handleClose('login')
            }
        }).catch((error) => {
            console.log(error);
            setIsContentLoading(false)
            setIsSubmitting(false)
        });
    }

    return (
        <>
            <Modal
                backdrop="static"
                centered
                show={isSignINModalOpen}
                dialogClassName="onboarding-modal"
                contentClassName=""
            >
                <div className="modal-accent" />

                <button
                    onClick={() => { reset(); handleClose('login'); }}
                    className="modal-close-btn"
                    aria-label="Close"
                >
                    <i className="bi bi-x-lg" />
                </button>

                <div className="onboarding-header">
                    <div className="brand-icon">
                        <i className="bi bi-book" style={{ color: '#019D5F' }} />
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue to Kitaab</p>
                </div>

                <form autoComplete="off" onSubmit={handleSubmit(formSubmitHandler)}>
                    <div className="onboarding-body">
                        <div className="ob-field">
                            <label className="ob-label">Email or Phone</label>
                            <div className="ob-input-wrapper">
                                <i className="bi bi-person ob-input-icon" />
                                <input
                                    className={`ob-input ${errors?.emailOrphone ? 'has-error' : ''}`}
                                    type="text"
                                    autoComplete="emailOrphone"
                                    {...register('emailOrphone', {
                                        required: 'Please enter your phone or email.'
                                    })}
                                    placeholder="Enter your phone or email"
                                    autoFocus
                                />
                            </div>
                            {errors?.emailOrphone &&
                                <span className="ob-error">{errors.emailOrphone.message}</span>
                            }
                        </div>

                        <div className="ob-field">
                            <label className="ob-label">Password</label>
                            <div className="ob-input-wrapper">
                                <i className="bi bi-lock ob-input-icon" />
                                <input
                                    className={`ob-input ${errors?.password ? 'has-error' : ''}`}
                                    autoComplete="current-password"
                                    {...register('password', {
                                        required: 'Please enter your password.',
                                    })}
                                    name="password"
                                    placeholder="Enter your password"
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

                        <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                            <Link
                                className="forgot-link"
                                onClick={() => {
                                    handleClose('login')
                                    setForgotShowModal(true)
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            className="ob-submit-btn"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="btn-spinner" />
                            ) : (
                                <>Sign In</>
                            )}
                        </button>
                    </div>
                </form>

                <div className="onboarding-footer">
                    <p className="ob-switch-text">
                        Don't have an account?
                        <Link
                            className="ob-switch-link"
                            onClick={() => {
                                dispatch(openSignupModal())
                                handleClose('login')
                            }}
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </Modal>

            <ForgotPassword
                setIsContentLoading={setIsContentLoading}
                forgotShowModal={forgotShowModal}
                setForgotShowModal={setForgotShowModal}
            />

            <SignUp
                setIsContentLoading={setIsContentLoading}
                signUpShowModal={isSignupModalOpen}
            />
        </>
    )
}

export default Login;
