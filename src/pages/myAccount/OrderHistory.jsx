import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Auth from "../../auth/Auth";
import { axiosInstance, headers } from "../../axios/axios-config";

function OrderHistory() {

    const location = useLocation()

    const getOrderHistoryHandlder = () => {
        axiosInstance['get']('cart', {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {
                console.log(res);
            }
        }).catch((error) => {

        });
    }

    useEffect(() => {
        if (location.pathname === '/account/order-history') {
            getOrderHistoryHandlder()
        }
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