import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

import Auth from "../../../auth/Auth";
import { axiosInstance, headers } from "../../../axios/axios-config";
import { PaginationControl } from "react-bootstrap-pagination-control";
import SellBuyOrderDetail from "./SellBuyOrderDetail";
import SellOrdersList from "./SellOrdersList";
import BuyOrdersList from "./BuyOrdersList";

function SellBuyModuleMainLayout() {

    const location = useLocation()
    const useLoggedIN = Auth.loggedInUser()

    const [modalShow, setModalShow] = useState(false)
    const [modalType, setModalType] = useState(undefined)
    const [modalData, setModalData] = useState(undefined)


    const [orderList, setOrderList] = useState()
    const [sellerList, setSellerList] = useState()
    const [contentLoading, setContentLoading] = useState(true)
    const [pagination, setPagination] = useState()

    const getOrderHistoryHandlder = (apiSlug) => {
        setContentLoading(true)
        setOrderList([])
        setSellerList([])
        const params = {
            user_id: useLoggedIN?.id,
            page: 1,
            size: 15
        }
        axiosInstance['get'](apiSlug + '?' + new URLSearchParams(params), {
            headers: {
                ...headers,
                Authorization: `Bearer ${Auth.token()}`,
            }
        }).then((res) => {
            if (res) {

                const { data } = res.data
                // console.log(data);
                if (apiSlug === 'order-history') {
                    setOrderList(data)
                } else if (apiSlug === 'sell-history') {
                    setSellerList(data)
                }

                setPagination({
                    total: res.data.total,
                    per_page: res.data.per_page,
                    current_page: res.data.current_page
                })
                setContentLoading(false)
            }
        }).catch((error) => {
            setContentLoading(false)
        });
    }

    useEffect(() => {
        if (!modalShow) {
            setModalType(undefined)
            setModalData(undefined)
        }
    }, [modalShow])

    useEffect(() => {

        getOrderHistoryHandlder(location.pathname === '/account/order-history' ? 'order-history' : 'sell-history')

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            {/* <Table striped bordered >
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

                    {(!contentLoading && ((location.pathname === '/account/order-history' ? orderList : sellerList)?.length === 0)) &&
                        <tr>
                            <td colSpan={5} className="text-center">
                                No {location.pathname === '/account/order-history' ? 'order' : 'sell'} history.
                            </td>
                        </tr>
                    }

                    {orderList && orderList.map((ord, index) =>
                        <tr key={index}>
                            <td>{index + (pagination?.current_page - 1) * pagination?.per_page + 1}</td>
                            <td>{ord.unique_id || ('ord-' + ord.id)}</td>
                            <td>{ord.title}</td>
                            <td>{ord.quantity}</td>
                            <td>
                                <Button onClick={() => {
                                    setModalShow(true)
                                    setModalType(location.pathname === '/account/order-history' ? 'order' : 'sell')
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
            </Table> */}

            {location.pathname === '/account/order-history' ?
                <SellOrdersList
                    sellerList={sellerList}
                    contentLoading={contentLoading}
                    pagination={pagination}
                    setModalShow={setModalShow}
                    setModalType={setModalType}
                    setModalData={setModalData}
                />
                :
                <BuyOrdersList
                    sellerList={orderList}
                    contentLoading={contentLoading}
                    pagination={pagination}
                    setModalShow={setModalShow}
                    setModalType={setModalType}
                    setModalData={setModalData}
                />
            }

            {(!contentLoading && pagination?.total > 15) &&
                <PaginationControl
                    page={pagination?.current_page}
                    // between={4}
                    total={pagination?.total}
                    limit={pagination?.per_page}
                    changePage={(page) => {
                        setPagination({ ...pagination, current_page: page })
                    }}
                // ellipsis={1}
                />
            }
            <SellBuyOrderDetail
                type={modalType}
                data={modalData}
                modalShow={modalShow}
                setModalShow={setModalShow} />
        </>
    )
}

export default SellBuyModuleMainLayout;