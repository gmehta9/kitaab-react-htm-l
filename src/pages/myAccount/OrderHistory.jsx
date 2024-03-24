import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function OrderHistory() {

    const location = useLocation()

    useEffect(() => {

        console.log(location.pathname === '/account/order-history');

    }, [location.pathname])

    return (
        <>
            <Table striped bordered >

                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Order Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    <tr>
                        <td colSpan={4} className="text-center">
                            No {location.pathname === '/account/order-history' ? 'order' : 'sell'} history.
                        </td>
                    </tr>

                </tbody>
            </Table>
        </>
    )
}

export default OrderHistory;