import { useEffect } from "react";
import { Button, Spinner, Table } from "react-bootstrap";

function BuyOrdersList({ orderList, contentLoading, pagination, setModalShow, setModalType, setModalData }) {

    useEffect(() => {
        document.title = 'Buy Order | Kitaab Juction';
    }, [])
    return (
        <>
            <Table striped bordered >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Order Title</th>
                        <th>Author</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {contentLoading &&
                        <tr>
                            <td colSpan={5} className="text-center">
                                <Spinner
                                    className="mx-auto"
                                    animation="border"
                                    variant="secondary" />
                            </td>
                        </tr>
                    }

                    {(!contentLoading && orderList?.length === 0) &&
                        <tr>
                            <td colSpan={5} className="text-center">
                                No order history.
                            </td>
                        </tr>
                    }

                    {orderList && orderList.map((ord, index) =>
                        <tr key={index}>
                            <td>{index + (pagination?.current_page - 1) * pagination?.per_page + 1}</td>
                            <td>{ord.unique_id || ('ord-' + ord.id)}</td>
                            <td>{ord.title}</td>
                            <td>{ord?.auther}</td>
                            <td>
                                <Button onClick={() => {
                                    setModalShow(true)
                                    setModalType('order')
                                    setModalData(ord)
                                }}
                                    type="button"
                                    variant="info"
                                    size="sm"
                                    className="pb-0">
                                    View Detail
                                </Button>
                            </td>
                        </tr>
                    )}


                </tbody>
            </Table>
        </>
    )
}

export default BuyOrdersList;