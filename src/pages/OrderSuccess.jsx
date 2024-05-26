import { useNavigate } from "react-router-dom";

function OrderSuccess() {
    const navigate = useNavigate()

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="message-box ">
                        <div className="success-container rounded-4 pb-4">

                            <br />
                            <div className="checkmark-succ">
                                <svg className="animated-check" viewBox="0 0 24 24">
                                    <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" /> </svg>
                            </div>
                            <br />
                            <div style={{ paddingLeft: '5%', paddingRight: '5%' }}>
                                <hr />
                            </div>
                            <br />
                            <h1 className="monserrat-font" style={{ color: 'Grey' }}>Thank you for your order</h1>
                            <br />

                            <div className="confirm-green-box">
                                <br />
                                <h4 className="font-weight-bolder">ORDER CONFIRMATION</h4>
                                <p>Your order #2465 has been sucessful!</p>
                                <p>Thank you for choosing KitabJunction. You will shortly receive a confirmation email.</p>
                            </div>

                            <br />
                            <button
                                onClick={() => navigate('/account/order-history')}
                                id="create-btn"
                                className="btn btn-outline-secondary margin-left-5px ">View Order History</button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSuccess;