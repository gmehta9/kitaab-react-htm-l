import { Image, Modal, Table } from "react-bootstrap";
import { MEDIA_URL, replaceLogo } from "../../../helper/Utils";
import { useEffect } from "react";
import '../../../styles/order-detail-modal.scss';

function SellBuyOrderDetail({ type, data, modalShow, setModalShow }) {
    useEffect(() => {
        document.title = 'Sell Order | Kitaab Juction';
    }, [])

    return (
        <Modal
            show={modalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            className="order-detail-modal"
            centered>
            <div className="modal-header-custom">
                <div className="modal-title-custom">
                    Order Details <span className="order-id">({data?.unique_id})</span>
                </div>
                <button
                    className="close-btn-custom"
                    onClick={() => setModalShow(undefined)}>
                    ×
                </button>
            </div>

            <Modal.Body>
                <div className="row">
                    {/* Customer Info - Show when viewing from buyer's perspective */}
                    {/* {type !== 'sell' && data?.shipping_name && (
                        <div className="col-md-6 mb-4">
                            <div className="info-card">
                                <div className="card-header-custom">
                                    <i className="bi bi-person-circle"></i>
                                    Customer Information
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Name:</span>
                                    <span className="info-value text-capitalize">{data?.shipping_name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{data?.shipping_email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Address:</span>
                                    <span className="info-value">{data?.shipping_address}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">City:</span>
                                    <span className="info-value text-capitalize">{data?.shipping_city}</span>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* Seller Info - Show when viewing from seller's perspective */}
                    {/* {type !== 'buy' && data?.product_owner_name && (
                        <div className="col-md-6 mb-4">
                            <div className="info-card">
                                <div className="card-header-custom">
                                    <i className="bi bi-shop"></i>
                                    Seller Information
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Name:</span>
                                    <span className="info-value">{data?.product_owner_name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{data?.product_owner_email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Address:</span>
                                    <span className="info-value text-capitalize">{data?.product_owner_address}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">City:</span>
                                    <span className="info-value text-capitalize">{data?.product_owner_city}</span>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>

                {/* Order Type Badge */}
                <div className="order-type-badge">
                    <span className="badge-label">Order Type:</span>
                    <span className="badge-value">
                        {data?.shipping_order_type === 'self_pickup' ? '📦 Self Pickup' : '🚚 Paid Delivery'}
                    </span>
                </div>

                {/* Order Details Table */}
                <div className="order-details-table table-responsive">
                    <Table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Type</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>{data?.unique_id}</strong></td>
                                <td>
                                    <Image
                                        onError={replaceLogo}
                                        src={MEDIA_URL + 'product/' + data?.image}
                                        className="product-image"
                                        alt={data?.title}
                                    />
                                </td>
                                <td><strong>{data?.title}</strong></td>
                                <td>{data?.auther}</td>
                                <td>
                                    <span className={`transact-type-badge ${data?.transact_type}`}>
                                        {data?.transact_type}
                                    </span>
                                </td>
                                <td className="price-value">
                                    {data?.transact_type === 'sell'
                                        ? `₹ ${data?.sale_price || data?.price}/-`
                                        : 'Free'}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default SellBuyOrderDetail;