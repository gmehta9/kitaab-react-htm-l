import { Image, Modal } from "react-bootstrap";
import { MEDIA_URL, replaceLogo } from "../../../helper/Utils";
import { useEffect } from "react";
import '../../../styles/order-detail-modal.scss';

function SellBuyOrderDetail({ type, data, modalShow, setModalShow }) {
    useEffect(() => {
        document.title = 'Order Detail | Kitaab Junction';
    }, [])

    const isSell = data?.transact_type === 'sell';
    const price = data?.sale_price || data?.price;

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <Modal
            show={modalShow}
            aria-labelledby="contained-modal-title-vcenter"
            className="order-detail-modal"
            dialogClassName="order-detail-dialog"
            centered>

            <div className="od-accent" />

            <button
                className="od-close-btn"
                onClick={() => setModalShow(undefined)}
                aria-label="Close">
                <i className="bi bi-x-lg" />
            </button>

            {/* Header */}
            <div className="od-header">
                <div className="od-icon">
                    <i className="bi bi-receipt" />
                </div>
                <h2>Order Details</h2>
                <span className="od-order-id">{data?.unique_id}</span>
            </div>

            <div className="od-body">
                {/* Product Card */}
                <div className="od-product-card">
                    <div className="od-product-image">
                        <Image
                            onError={replaceLogo}
                            src={MEDIA_URL + 'product/' + data?.image}
                            alt={data?.title}
                        />
                    </div>
                    <div className="od-product-info">
                        <h3 className="od-product-title">{data?.title}</h3>
                        <p className="od-product-author">
                            <i className="bi bi-person" /> {data?.auther}
                        </p>

                        <div className="od-meta-row">
                            <span className={`od-type-badge ${data?.transact_type}`}>
                                {isSell ? 'Purchase' : 'Shared'}
                            </span>
                            <span className="od-price">
                                {isSell ? `₹ ${price}/-` : 'Free'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Info Grid */}
                <div className="od-info-grid">
                    {data?.quantity && (
                        <div className="od-info-item">
                            <span className="od-info-label">Quantity</span>
                            <span className="od-info-value">{data.quantity}</span>
                        </div>
                    )}
                    {(data?.created_at || data?.createdAt) && (
                        <div className="od-info-item">
                            <span className="od-info-label">Order Date</span>
                            <span className="od-info-value">{formatDate(data.created_at || data.createdAt)}</span>
                        </div>
                    )}
                    {data?.shipping_price && (
                        <div className="od-info-item">
                            <span className="od-info-label">Delivery Charge</span>
                            <span className="od-info-value">₹ {data.shipping_price}/-</span>
                        </div>
                    )}
                    {(data?.status || data?.order_status) && (
                        <div className="od-info-item">
                            <span className="od-info-label">Status</span>
                            <span className="od-info-value od-status-value text-capitalize">
                                {data.status || data.order_status}
                            </span>
                        </div>
                    )}
                </div>

                {/* Delivery Info */}
                <div className="od-delivery-strip">
                    <i className={`bi ${data?.shipping_order_type === 'self_pickup' ? 'bi-box-seam' : 'bi-truck'}`} />
                    <span>
                        {data?.shipping_order_type === 'self_pickup' ? 'Self Pickup' : 'Paid Delivery'}
                    </span>
                </div>

                {/* Shipping Details */}
                {data?.shipping_name && (
                    <div className="od-section">
                        <div className="od-section-title">
                            <i className="bi bi-geo-alt" /> Shipping Details
                        </div>
                        <div className="od-detail-list">
                            <div className="od-detail-row">
                                <span className="od-detail-label">Name</span>
                                <span className="od-detail-value text-capitalize">{data.shipping_name}</span>
                            </div>
                            {data?.shipping_email && (
                                <div className="od-detail-row">
                                    <span className="od-detail-label">Email</span>
                                    <span className="od-detail-value">{data.shipping_email}</span>
                                </div>
                            )}
                            {data?.shipping_phone_no && (
                                <div className="od-detail-row">
                                    <span className="od-detail-label">Phone</span>
                                    <span className="od-detail-value">{data.shipping_phone_no}</span>
                                </div>
                            )}
                            {data?.shipping_address && (
                                <div className="od-detail-row">
                                    <span className="od-detail-label">Address</span>
                                    <span className="od-detail-value text-capitalize">{data.shipping_address}</span>
                                </div>
                            )}
                            {(data?.shipping_city || data?.shipping_state) && (
                                <div className="od-detail-row">
                                    <span className="od-detail-label">Location</span>
                                    <span className="od-detail-value text-capitalize">
                                        {[data.shipping_city, data.shipping_state].filter(Boolean).join(', ')}
                                        {data?.shipping_pin_code ? ` - ${data.shipping_pin_code}` : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Seller / Buyer Info */}
                {type === 'buy' && data?.product_owner_name && (
                    <div className="od-section">
                        <div className="od-section-title">
                            <i className="bi bi-shop" /> Seller Info
                        </div>
                        <div className="od-detail-list">
                            <div className="od-detail-row">
                                <span className="od-detail-label">Name</span>
                                <span className="od-detail-value text-capitalize">{data.product_owner_name}</span>
                            </div>
                            {data?.product_owner_email && (
                                <div className="od-detail-row">
                                    <span className="od-detail-label">Email</span>
                                    <span className="od-detail-value">{data.product_owner_email}</span>
                                </div>
                            )}
                            {data?.product_owner_city && (
                                <div className="od-detail-row">
                                    <span className="od-detail-label">City</span>
                                    <span className="od-detail-value text-capitalize">{data.product_owner_city}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {type === 'sell' && data?.buyer_name && (
                    <div className="od-section">
                        <div className="od-section-title">
                            <i className="bi bi-person-circle" /> Buyer Info
                        </div>
                        <div className="od-detail-list">
                            <div className="od-detail-row">
                                <span className="od-detail-label">Name</span>
                                <span className="od-detail-value text-capitalize">{data.buyer_name}</span>
                            </div>
                            {data?.buyer_email && (
                                <div className="od-detail-row">
                                    <span className="od-detail-label">Email</span>
                                    <span className="od-detail-value">{data.buyer_email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default SellBuyOrderDetail;
