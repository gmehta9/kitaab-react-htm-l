import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Auth from "../../auth/Auth";
import { axiosInstance, headers } from "../../axios/axios-config";

function OrderHistory() {

    const location = useLocation()
    const useLoggedIN = Auth.loggedInUser()

    const [orderList, setOrderList] = useState()
    const [pagination, setPagination] = useState()

    const getOrderHistoryHandlder = () => {

        const params = {
            user_id: useLoggedIN?.id,
            page: 1,
            size: 30
        }
        axiosInstance['get']('order?' + new URLSearchParams(params), {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {

                const { data } = res.data
                setOrderList(data)
                setPagination({
                    total: res.total,
                    per_page: res.per_page,
                    current_page: res.current_page
                })
            }
        }).catch((error) => {

        });
    }
    console.log(orderList);
    useEffect(() => {

        if (location.pathname === '/account/order-history') {
            getOrderHistoryHandlder()
        }

    }, [location.pathname])

    return (
        <>
            {/* <div className="d-flex align-items-center justify-content-end mb-3">
                filter by:

                <button
                    className={`btn border m-2 ${activeLink === 'buy' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveLink('buy')}>Buy Order</button>

                <button
                    className={`btn border m-2 ${activeLink === 'sell' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveLink('sell')}>Sell Order</button>

            </div> */}

            <Table striped bordered >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Order Title</th>
                        <th>Order Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {orderList?.length === 0 &&
                        <tr>
                            <td colSpan={4} className="text-center">
                                No {location.pathname === '/account/order-history' ? 'order' : 'sell'} history.
                            </td>
                        </tr>
                    }

                    {orderList && orderList.map((ord, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>order-{ord.id}</td>
                            <td>{ord.title}</td>
                            <td>{ord.quantity}</td>
                            <td></td>
                        </tr>
                    )}


                </tbody>
            </Table>
        </>
    )
}

export default OrderHistory;