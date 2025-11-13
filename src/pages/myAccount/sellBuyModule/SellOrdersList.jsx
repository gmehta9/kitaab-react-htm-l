import { Button, Table } from "react-bootstrap";
import TableRowSkeleton from "../../../components/skeletons/TableRowSkeleton";
import '../../../styles/order-history.scss';

function SellOrdersList({ sellerList, contentLoading, pagination, setModalShow, setModalType, setModalData }) {

    return (
        <div className="order-history-container">
            <div className="scroll-indicator">
                <i className="bi bi-arrow-left-right"></i> Scroll horizontally to view all columns
            </div>
            <div className="order-history-table-wrapper">
                <Table striped bordered>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Order Title</th>
                        <th>Author</th>
                        {/* <th>Buyer Id </th> */}
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {contentLoading && <TableRowSkeleton rows={5} columns={5} />}

                    {(!contentLoading && sellerList?.length === 0) &&
                        <tr className="empty-state-row">
                            <td colSpan={5}>
                                No sell order history found.
                            </td>
                        </tr>
                    }

                    {sellerList && sellerList.map((ord, index) =>
                        <tr key={index}>
                            <td className="order-number">{index + (pagination?.current_page - 1) * pagination?.per_page + 1}</td>
                            <td className="order-id">{ord.unique_id || ('ord-' + ord.id)}</td>
                            <td className="order-title" title={ord.title}>{ord.title}</td>
                            <td className="author-name">{ord?.auther}</td>
                            <td>
                                <Button onClick={() => {
                                    setModalShow(true)
                                    setModalType('sell')
                                    setModalData(ord)
                                }}
                                    type="button"
                                    variant="info"
                                    size="sm">
                                    View Detail
                                </Button>
                            </td>
                        </tr>
                    )}


                </tbody>
            </Table>
            </div>
        </div>
    )
}

export default SellOrdersList;