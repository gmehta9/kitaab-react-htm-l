import { Image, Modal, Table } from "react-bootstrap";
import { MEDIA_URL, replaceLogo } from "../../../helper/Utils";

function SellBuyOrderDetail({ type, data, modalShow, setModalShow }) {
    console.log(data);
    return (
        <>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter">
                <div className="d-flex pt-4 pl-4 position-relative">
                    <span className="h5 font-weight-bold mx-auto">Order Detail (data?.unique_id)</span>
                    <span className="btn btn-dark p-1 lh-1 position-absolute" onClick={() => setModalShow(undefined)}>X</span>
                </div>
                <Modal.Body>

                    <div className="row my-4 px-3">
                        <div className="col-md-6">
                            <div className="curtomer-detail bg-light p-1 mb-2">
                                Customer info
                            </div>
                            <div className="row">
                                <div className="col-3 small">Name:</div>
                                <div className="col small font-weight-bold">{data?.title}</div>
                            </div>
                            <div className="row">
                                <div className="col-3 small">Email ID:</div>
                                <div className="col small font-weight-bold">{data?.email}</div>
                            </div>
                            <div className="row">
                                <div className="col-3 small">Phone No:</div>
                                <div className="col small font-weight-bold">{data?.Phone}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">Address:</div>
                                <div className="col small font-weight-bold">{data?.address}</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="Seller-detail bg-light p-1 mb-2">
                                Seller detail
                            </div>
                            <div className="row">
                                <div className="col-3 small">Name:</div>
                                <div className="col small font-weight-bold">{data?.product_owner_name}</div>
                            </div>
                            <div className="row">
                                <div className="col-3 small">Email ID:</div>
                                <div className="col small font-weight-bold">{data?.product_owner_email}</div>
                            </div>
                            <div className="row">
                                <div className="col-3 small">Phone No:</div>
                                <div className="col small font-weight-bold">{data?.product_owner_phone}</div>
                            </div>
                            <div className="row">
                                <div className="col-3 small">Address:</div>
                                <div className="col small font-weight-bold">{data?.product_owner_address}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <Table>
                            <thead>
                                <th>Order ID</th>
                                <th>Order Image</th>
                                <th>Order Title</th>
                                <th>Author</th>
                                <th>Order Transec type</th>
                                <th>Order Price</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{data?.unique_id}</td>
                                    <td>
                                        <Image
                                            onError={replaceLogo}
                                            width={'50px'}
                                            height={'70px'}
                                            src={MEDIA_URL + 'product/' + data?.image}
                                            className="thumbnail rounded" />
                                    </td>
                                    <td>{data?.title}</td>
                                    <td>{data?.auther}</td>
                                    <td>{data?.transact_type}</td>
                                    <td>{data?.transact_type === 'sell' ? data?.sale_price || data?.price : '0'}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    {/* <Button onClick={props.onHide}>Close</Button> */}
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default SellBuyOrderDetail;