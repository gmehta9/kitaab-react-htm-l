import { Container } from "react-bootstrap";

function ContactPage() {

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
                        <div className="row g-4">
                            <div className="col-6 mb-3">
                                <label for="exampleFormControlInput1" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                            </div>
                            <div className="col-6 mb-3">
                                <label for="exampleFormControlInput1" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label for="exampleFormControlInput1" className="form-label">Email ID</label>
                            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleFormControlInput1" className="form-label">Phone Number</label>
                            <input type="tel" className="form-control" id="exampleFormControlInput1" placeholder="" />
                        </div>
                        <div className="mb-3">
                            <label for="exampleFormControlTextarea1" className="form-label">Message</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                        <button type="button" className="btn btn-dark">Send Message</button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ContactPage;