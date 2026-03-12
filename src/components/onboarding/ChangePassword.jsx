import { useState } from "react";
import { Modal } from "react-bootstrap";
import { axiosInstance } from "../../axios/axios-config";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import "../../styles/onboarding.scss";

function ChangePassword({ changePasswordShow, setChangePasswordShow }) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showOldPass, setShowOldPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ mode: 'onChange' })

    const handleClose = () => {
        reset()
        setChangePasswordShow(false)
    }

    const changePasswordFormSubmitHandler = (data) => {
        setIsSubmitting(true)
        axiosInstance.post("auth/pass-change", data).then((res) => {
            if (res) {
                toast.success("Password updated successfully!");
                setIsSubmitting(false)
                handleClose()
            }
        }).catch((error) => {
            setIsSubmitting(false)
        });
    }

    return (
        <Modal
            backdrop="static"
            centered
            show={changePasswordShow}
            dialogClassName="onboarding-modal"
        >
            <div className="modal-accent" />

            <button
                onClick={handleClose}
                className="modal-close-btn"
                aria-label="Close"
            >
                <i className="bi bi-x-lg" />
            </button>

            <div className="onboarding-header">
                <div className="brand-icon">
                    <i className="bi bi-shield-lock" style={{ color: '#019D5F' }} />
                </div>
                <h2>Change Password</h2>
                <p>Keep your account secure with a strong password</p>
            </div>

            <form autoComplete="off" onSubmit={handleSubmit(changePasswordFormSubmitHandler)}>
                <div className="onboarding-body">

                    {/* Old Password */}
                    <div className="ob-field">
                        <label className="ob-label">
                            Current Password <span className="required">*</span>
                        </label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-lock ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.old_password ? 'has-error' : ''}`}
                                autoComplete="current-password"
                                {...register('old_password', {
                                    required: 'Please enter your current password.',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters.'
                                    }
                                })}
                                placeholder="Enter your current password"
                                type={showOldPass ? 'text' : 'password'}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowOldPass(!showOldPass)}
                                tabIndex={-1}
                            >
                                <i className={`bi ${showOldPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>
                        {errors?.old_password &&
                            <span className="ob-error">{errors.old_password.message}</span>
                        }
                    </div>

                    {/* New Password */}
                    <div className="ob-field">
                        <label className="ob-label">
                            New Password <span className="required">*</span>
                        </label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-lock-fill ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.new_password ? 'has-error' : ''}`}
                                autoComplete="new-password"
                                {...register('new_password', {
                                    required: 'Please enter your new password.',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters.'
                                    }
                                })}
                                placeholder="Enter your new password"
                                type={showNewPass ? 'text' : 'password'}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowNewPass(!showNewPass)}
                                tabIndex={-1}
                            >
                                <i className={`bi ${showNewPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>
                        {errors?.new_password &&
                            <span className="ob-error">{errors.new_password.message}</span>
                        }
                    </div>

                    {/* Confirm Password */}
                    <div className="ob-field">
                        <label className="ob-label">
                            Confirm Password <span className="required">*</span>
                        </label>
                        <div className="ob-input-wrapper">
                            <i className="bi bi-check2-circle ob-input-icon" />
                            <input
                                className={`ob-input ${errors?.password_confirmation ? 'has-error' : ''}`}
                                autoComplete="new-password"
                                {...register('password_confirmation', {
                                    required: 'Please confirm your new password.',
                                    validate: (val) => {
                                        if (watch("new_password") !== val) {
                                            return "New password and confirmation do not match.";
                                        }
                                    },
                                })}
                                placeholder="Re-enter your new password"
                                type={showConfirmPass ? 'text' : 'password'}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                tabIndex={-1}
                            >
                                <i className={`bi ${showConfirmPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>
                        {errors?.password_confirmation &&
                            <span className="ob-error">{errors.password_confirmation.message}</span>
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
                            <>Update Password</>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default ChangePassword;
