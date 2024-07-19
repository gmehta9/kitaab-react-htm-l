import { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Image, Spinner } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useForm } from "react-hook-form";
import { axiosInstance, headers } from "../../axios/axios-config";
import Auth from "../../auth/Auth";
import { formatDateTime, srcPriFixLocal } from "../../helper/Helper";
import { useOutletContext } from "react-router-dom";

function Wishlist() {
    const [years, setYears] = useState();
    const [wishlist, setWishlist] = useState();
    const [modalShowWL, setModalShowWL] = useState(undefined);
    const [editObj, setEditObj] = useState(undefined);
    const { isContentLoading, setIsContentLoading } = useOutletContext();
    const [pagination, setPagination] = useState();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ mode: 'onChange' })

    const getWishListHandler = (p) => {
        const params = {
            page: p,
            size: 50,
        };
        setIsContentLoading(true)
        axiosInstance.get(`${'wishlist'}?${new URLSearchParams(params)}`, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((response) => {
            if (response) {
                setWishlist(response.data.data)
                setPagination({
                    total: response.data.total,
                    per_page: response.data.per_page,
                    current_page: response.data.current_page
                })
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    const wishListSubmitHandler = (data) => {
        setIsContentLoading(true)
        let method = 'post'
        let apisulg = `wishlist`

        if (modalShowWL === 'edit') {
            method = 'put'
            apisulg = apisulg + '/' + editObj.id
        }

        axiosInstance[method](apisulg, data, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((response) => {
            if (response) {

                if (modalShowWL === 'edit') {
                    const wlUpdate = wishlist.map(wlItem => {
                        if (wlItem.id === editObj.id) {
                            wlItem.title = data.title
                            wlItem.author = data.author
                            wlItem.publication_year = data.publication_year
                        }
                        return wlItem
                    })
                    setWishlist(wlUpdate)
                } else {
                    getWishListHandler(pagination.current_page)
                }
                setModalShowWL(undefined)
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    const deletitemHandler = (wl) => {
        setIsContentLoading(true)
        axiosInstance.delete(`wishlist/` + wl.id, {
            headers: {
                ...headers,
                ...(Auth.token() && { Authorization: `Bearer ${Auth.token()}` })
            }
        }).then((response) => {
            if (response) {
                const wlUpdate = wishlist.filter(wlItem => wlItem.id !== wl.id)
                setWishlist(wlUpdate)
                setIsContentLoading(false)
            }
        }).catch((error) => {
            setIsContentLoading(false)
        });
    }

    const onHideModal = () => {
        setIsContentLoading(false)
        setEditObj(undefined)
        setModalShowWL(undefined)
        reset()

    }


    useEffect(() => {
        if (modalShowWL === 'edit') {
            setValue('title', editObj.title)
            setValue('author', editObj.author)
            setValue('publication_year', editObj.publication_year)
        } else if (modalShowWL !== 'edit') {
            reset()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalShowWL])

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 45 }, (_, index) => (currentYear - index).toString());
        setYears(years)
        getWishListHandler(1)

        document.title = 'My Wishlist | Kitaab Juction';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="font-weight-bold">Wish List</h5>

                <button
                    onClick={() => setModalShowWL('add')}
                    type="button"
                    className="btn btn-dark">Add Wish List</button>

            </div>

            <Table striped bordered >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Request Date</th>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Publication Year</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {isContentLoading &&
                        <tr>
                            <td colSpan={6} className="text-center">
                                <Spinner
                                    className="mx-auto"
                                    animation="border"
                                    variant="secondary" />
                            </td>
                        </tr>

                    }
                    {(!isContentLoading && wishlist?.length === 0) &&
                        <tr>
                            <td colSpan={6} className="text-center">
                                No record Found!
                            </td>
                        </tr>
                    }

                    {wishlist && wishlist.map((wl, index) =>
                        <tr key={index + 'w'}>
                            <td>{index + (pagination?.current_page - 1) * pagination?.per_page + 1}</td>
                            <td>{formatDateTime(new Date(wl?.created_at), 'DD/MM/YYYY')}</td>
                            <td>{wl?.title}</td>
                            <td>{wl?.author}</td>
                            <td>{wl?.publication_year}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <span
                                        className="hand m-2 h5 lh-normal"
                                        onClick={() => {
                                            setEditObj(wl)
                                            setModalShowWL('edit')
                                        }}>
                                        <i className='bx bx-edit-alt' size="30px"></i>
                                    </span>
                                    <span onClick={() => deletitemHandler(wl)}>
                                        <Image
                                            src={`${srcPriFixLocal}delete_icon.svg`}
                                        />
                                    </span>
                                </div>
                            </td>
                        </tr>
                    )}


                </tbody>
            </Table>

            {pagination?.total > 15 &&
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

            <Modal backdrop="static" centered show={modalShowWL ? true : false} >
                <Modal.Header className="position-relative justify-content-center border-0">
                    <Modal.Title className="font-weight-bold">
                        {modalShowWL === 'edit' ? 'Edit' : 'Create'} Wish List
                    </Modal.Title>
                    <button
                        type="button"
                        onClick={onHideModal}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Form autoComplete="false" onSubmit={handleSubmit(wishListSubmitHandler)}>
                    <Modal.Body className="border-0 px-5">
                        <Form.Group className="mb-4" controlId="old_password">
                            <Form.Label>Book Title<sup className="text-danger small">*</sup></Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('title', {
                                    required: 'Please enter book title.',

                                })}
                                placeholder="Enter your book title."
                                type="text"
                            />
                            {errors?.title &&
                                <span className="text-danger small position-absolute">
                                    {errors?.title?.message}
                                </span>
                            }
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="old_password">
                            <Form.Label>Book Author<sup className="text-danger small">*</sup></Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('author', {
                                    required: 'Please enter book Author.',

                                })}
                                placeholder="Enter book author."
                                type="text"
                            />
                            {errors?.author &&
                                <span className="text-danger small position-absolute">
                                    {errors?.author?.message}
                                </span>
                            }
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="old_password">
                            <Form.Label>Publication year<sup className="text-danger small">*</sup></Form.Label>
                            {/* <Form.Control
                                autoComplete="false"
                                {...register('publication_date', {
                                    required: 'Please enter publication date.',

                                })}
                                placeholder="Enter Publication Date."
                                type="text"
                            /> */}
                            <Form.Select
                                className="form-control"
                                aria-label="Default select example"
                                {...register('publication_year', {
                                    required: 'Please enter publication date.',

                                })}>
                                <option value="">Select Publication year</option>
                                {years && years.map((y, index) =>
                                    <option key={index + 'y'} value={y}>{y}</option>
                                )}

                            </Form.Select>

                            {errors?.publication_year &&
                                <span className="text-danger small position-absolute">
                                    {errors?.publication_year?.message}
                                </span>
                            }
                        </Form.Group>


                    </Modal.Body>

                    <Modal.Footer className="justify-content-center flex-column border-0 pt-0">

                        <Button
                            className="px-4 mb-3"
                            variant="primary"
                            type="submit"
                            disabled={isContentLoading}
                        >
                            {isContentLoading ? 'Please wait...' : `${modalShowWL === 'edit' ? 'Update' : 'Submit'}`}
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default Wishlist;