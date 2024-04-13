import { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useForm } from "react-hook-form";

function Wishlist() {
    const [years, setYears] = useState();
    const [wishlist, setWishlist] = useState()
    const [modalShowWL, setModalShowWL] = useState(undefined)
    const [isContentLoading, setIsContentLoading] = useState(false)
    const [pagination, setPagination] = useState()


    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ mode: 'onChange' })

    const submitWishListHandler = (data) => {
        setPagination({
            total: 50,
            per_page: 15,
            current_page: 1
        })
    }

    // useEffect(() => {
    //     if (modalShowWL === 'edit') {
    //     }
    // }, [modalShowWL])

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 45 }, (_, index) => (currentYear - index).toString());
        setYears(years)
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
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Publication Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {wishlist?.length === 0 &&
                        <tr>
                            <td colSpan={4} className="text-center">
                                No record Found!
                            </td>
                        </tr>
                    }

                    {wishlist && wishlist.map((ord, index) =>
                        <tr key={index}>
                            <td>{index + (pagination.current_page - 1) * pagination.per_page + 1}</td>
                            <td>order-{ord.id}</td>
                            <td>{ord.title}</td>
                            <td>{ord.quantity}</td>
                            <td></td>
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
                    <Modal.Title className="font-weight-bold">Create Wish List</Modal.Title>
                    <button
                        onClick={() => {
                            reset()
                            setIsContentLoading(false)
                            setModalShowWL(undefined)
                        }}
                        className="bg-transparent border-0 position-absolute close-btn">
                        ✖
                    </button>
                </Modal.Header>
                <Form autoComplete="false" onSubmit={handleSubmit(submitWishListHandler)}>
                    <Modal.Body className="border-0 px-5">
                        <Form.Group className="mb-4" controlId="old_password">
                            <Form.Label>Book Title<sup className="text-danger small">*</sup></Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('book_title', {
                                    required: 'Please enter book title.',

                                })}
                                placeholder="Enter your book title."
                                type="text"
                            />
                            {errors?.book_title &&
                                <span className="text-danger small position-absolute">
                                    {errors?.book_title?.message}
                                </span>
                            }
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="old_password">
                            <Form.Label>Book Author<sup className="text-danger small">*</sup></Form.Label>
                            <Form.Control
                                autoComplete="false"
                                {...register('book_author', {
                                    required: 'Please enter book Author.',

                                })}
                                placeholder="Enter book author."
                                type="text"
                            />
                            {errors?.book_author &&
                                <span className="text-danger small position-absolute">
                                    {errors?.book_author?.message}
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
                                {...register('publication_date', {
                                    required: 'Please enter publication date.',

                                })}>
                                <option value="">Select Publication year</option>
                                {years && years.map((y, index) =>
                                    <option key={index + 'y'} value={y}>{y}</option>
                                )}

                            </Form.Select>

                            {errors?.publication_date &&
                                <span className="text-danger small position-absolute">
                                    {errors?.publication_date?.message}
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
                            {isContentLoading ? 'Please wait...' : 'Submit'}
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default Wishlist;