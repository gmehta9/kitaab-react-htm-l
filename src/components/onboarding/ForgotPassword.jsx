import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axios/axios-config";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { openLoginModal } from "../../redux/authModalSlice";
import "../../styles/onboarding.scss";

function ForgotPassword({ forgotShowModal, setForgotShowModal, setIsContentLoading }) {

    const { register, handleSubmit, reset, setFocus, formState: { errors } } = useForm({ mode: 'onChange' })
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formSubmitHandler = (data) => {
        setIsSubmitting(true)
        setIsContentLoading(true)
        axiosInstance.post("auth/pass-reset", data).then((res) => {
            if (res) {
                toast.success("Password reset link sent to your email!");
                reset()
                setIsContentLoading(false)
                setIsSubmitting(false)
                setForgotShowModal(false)
            }
        }).catch((error) => {
            setFocus('email')
            setIsContentLoading(false)
            setIsSubmitting(false)
        });
    }

    return (
        <Modal
            backdrop="static"
            centered
            show={forgotShowModal}
            onHide={() => setForgotShowModal(false)}
            dialogClassName="onboarding-modal"
        >
            <div className="modal-accent" />

            <button
                onClick={() => { reset(); setForgotShowModal(false); }}
                className="modal-close-btn"
                aria-label="Close"
            >
                <i className="bi bi-x-lg" />
            </button>

            <div className="onboarding-header">
                <div className="brand-icon">
                    <i className="bi bi-key" style={{ color: '#019D5F' }} />
                </div>
                <h2>Forgot Password?</h2>
                <p>Enter your email and we'll send you a reset link</p>
            </div>

            <form autoComplete="off" onSubmit={handleSubmit(formSubmitHandler)}>
                <div className="onboarding-body">

                    <div className="ob-field">
                        <label className="ob-label">Email Address</label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-envelope ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.email ? 'has-error' : ''}`}
                                type="text"
                                autoComplete="email"
                                {...register('email', {
                                    required: 'Please enter your registered email.'
                                })}
                                placeholder="Enter your registered email"
                                autoFocus
                            />
                        </div>
                        {errors?.email &&
                            <span className="ob-error">{errors.email.message}</span>
                        }
                    </div>

                    <button
                        className="ob-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="btn-spinner" />
                        ) : (
                            <>Send Reset Link</>
                        )}
                    </button>
                </div>
            </form>

            <div className="onboarding-footer">
                <p className="ob-switch-text">
                    Remember your password?
                    <Link
                        className="ob-switch-link"
                        onClick={() => {
                            setForgotShowModal(false)
                            dispatch(openLoginModal())
                        }}
                    >
                        Back to Sign In
                    </Link>
                </p>
            </div>
        </Modal>
    )
}

export default ForgotPassword;
