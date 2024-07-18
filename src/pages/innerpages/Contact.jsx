import { useState } from "react";
import { Container, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { axiosInstance, headers } from "../../axios/axios-config";
import toast from "react-hot-toast";

function ContactPage() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onChange' })
    const [isSubmitting, setIsSubmitting] = useState()
    const leaveMessageHandler = (data) => {
        setIsSubmitting(true)
        axiosInstance.post("contact-us", data, { headers: headers }
        ).then((res) => {
            if (res) {
                toast.success("Form has been successfully submitted.");
                setIsSubmitting(false)
                reset()
            }
        }).catch((error) => {
            console.log(error);
            setIsSubmitting(false)
        });
    }
    return (
        <Container>
            <div className="mt-5">
                <h3 className="font-weight-bold">Contact us</h3>

                <div className="row g-5">
                    {/* <!-- Contact Information Block --> */}
                    <div className="col-xl-6">
                        <div className="row row-cols-md-2 g-4">
                            <div className="aos-item" data-aos="fade-up" data-aos-delay="200">
                                <div className="aos-item__inner">
                                    <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                                        <div className="d-flex justify-content-start">
                                            <i className='bx bxs-envelope h2' ></i>
                                            <div className="d-flex w-100 flex-column ml-2">
                                                <span className="h5">Email</span>
                                                <span>kitaabjunction@gmail.com</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="aos-item" data-aos="fade-up" data-aos-delay="400">
                                <div className="aos-item__inner">
                                    <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                                        <div className="d-flex justify-content-start">
                                            <i className='bx bxs-phone-call h2'></i>
                                            <div className="d-flex w-100 flex-column ml-2">
                                                <span className="h5">Phone</span>
                                                <span>+91-9810296981</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="aos-item mt-4" data-aos="fade-up" data-aos-delay="600">
                            <div className="aos-item__inner">
                                <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                                    <div className="d-flex justify-content-start">
                                        <i className='bx bxl-whatsapp-square h2'></i>
                                        <div className="d-flex w-100 flex-column ml-2">
                                            <div className="">WhatsApp</div>
                                            <div className="">+91-9810296981</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* <!-- Contact Form Block --> */}
                    <div className="col-xl-6">
                        <h2 className="pb-4">Leave a message</h2>
                        <Form onSubmit={handleSubmit(leaveMessageHandler)}>
                            <div className="row g-4">
                                <div className="col-6 mb-3">
                                    <label for="exampleFormControlInput1" className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        {...register('first_name', {
                                            required: 'Field Required!',
                                        })}
                                        className="form-control"
                                        id="exampleFormControlInput1" placeholder="" />
                                    {errors?.message?.first_name &&
                                        <div className="small text-danger">
                                            {errors?.message?.first_name}
                                        </div>
                                    }
                                </div>
                                <div className="col-6 mb-3">
                                    <label for="exampleFormControlInput1" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        {...register('last_name', {
                                            required: 'Field Required!',
                                        })}
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        placeholder=""
                                    />
                                    {errors?.message?.last_name &&
                                        <div className="small text-danger">
                                            {errors?.message?.last_name}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="mb-3">
                                <label for="exampleFormControlInput1" className="form-label">Email ID</label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Field Required!',
                                        pattern: {
                                            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                            message: "Enter valid email",
                                        }
                                    })}
                                    className="form-control"
                                    id="exampleFormControlInput1"
                                    placeholder=""
                                />
                                {errors?.message?.email &&
                                    <div className="small text-danger">
                                        {errors?.message?.email}
                                    </div>
                                }
                            </div>
                            <div className="mb-3">
                                <label for="exampleFormControlInput1" className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    {...register('phone_number', {
                                        required: "Phone no is required.",
                                        minLength: {
                                            value: 10,
                                            message: "The Phone no. must be 10 digits.",
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: "The Phone no. must be 10 digits.",
                                        },
                                        pattern: {
                                            // value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                                            value: /^[0-9]{10}$/,
                                            message: "The Phone no. must be 10 digits.",
                                        },
                                    })}
                                    className="form-control"
                                    id="exampleFormControlInput1"
                                    placeholder=""
                                />
                                {errors?.message?.phone_number &&
                                    <div className="small text-danger">
                                        {errors?.message?.phone_number}
                                    </div>
                                }
                            </div>
                            <div className="mb-3">
                                <label for="exampleFormControlTextarea1" className="form-label">Message</label>
                                <textarea
                                    {...register('message', {
                                        required: 'Field Required!',
                                    })}
                                    className="form-control"
                                    maxLength={500}
                                    id="exampleFormControlTextarea1"
                                    rows="3"></textarea>
                                {errors?.message?.message &&
                                    <div className="small text-danger">
                                        {errors?.message?.message}
                                    </div>
                                }
                            </div>
                            <button type="submit" disabled={isSubmitting} className="btn btn-dark px-5">
                                {isSubmitting ? <Spinner animation="border" size="sm" variant="light" /> : 'Send Message'}
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ContactPage;