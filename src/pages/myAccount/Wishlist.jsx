import { useEffect, useState } from "react";
import { Table, Modal, Image, Spinner } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios/axios-config";
import { formatDateTime } from "../../helper/Helper";
import { useOutletContext } from "react-router-dom";
import '../../styles/onboarding.scss';

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
        axiosInstance.get(`${'wishlist'}?${new URLSearchParams(params)}`).then((response) => {
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

        axiosInstance[method](apisulg, data).then((response) => {
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
        axiosInstance.delete(`wishlist/` + wl.id).then((response) => {
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
                                            src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}delete_icon.svg`}
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

            <Modal
                backdrop="static"
                centered
                show={modalShowWL ? true : false}
                dialogClassName="onboarding-modal">
                <div className="modal-accent" />

                <button
                    type="button"
                    onClick={onHideModal}
                    className="modal-close-btn"
                    aria-label="Close">
                    <i className="bi bi-x-lg" />
                </button>

                <div className="onboarding-header">
                    <div className="brand-icon">
                        <i className={`bi ${modalShowWL === 'edit' ? 'bi-pencil-square' : 'bi-heart'}`} style={{ color: '#019D5F' }} />
                    </div>
                    <h2>{modalShowWL === 'edit' ? 'Edit' : 'Add to'} Wish List</h2>
                    <p>{modalShowWL === 'edit' ? 'Update your wishlist entry' : 'Add a book you\'re looking for'}</p>
                </div>

                <form autoComplete="off" onSubmit={handleSubmit(wishListSubmitHandler)}>
                    <div className="onboarding-body">
                        <div className="ob-field">
                            <label className="ob-label">
                                Book Title <span className="required">*</span>
                            </label>
                            <div className="ob-input-wrapper">
                                <i className="bi bi-book ob-input-icon" />
                                <input
                                    className={`ob-input ${errors?.title ? 'has-error' : ''}`}
                                    autoComplete="off"
                                    {...register('title', {
                                        required: 'Please enter book title.',
                                    })}
                                    placeholder="Enter book title"
                                    type="text"
                                />
                            </div>
                            {errors?.title &&
                                <span className="ob-error">{errors.title.message}</span>
                            }
                        </div>

                        <div className="ob-field">
                            <label className="ob-label">
                                Book Author <span className="required">*</span>
                            </label>
                            <div className="ob-input-wrapper">
                                <i className="bi bi-person ob-input-icon" />
                                <input
                                    className={`ob-input ${errors?.author ? 'has-error' : ''}`}
                                    autoComplete="off"
                                    {...register('author', {
                                        required: 'Please enter book author.',
                                    })}
                                    placeholder="Enter book author"
                                    type="text"
                                />
                            </div>
                            {errors?.author &&
                                <span className="ob-error">{errors.author.message}</span>
                            }
                        </div>

                        <div className="ob-field">
                            <label className="ob-label">
                                Publication Year <span className="required">*</span>
                            </label>
                            <div className="ob-input-wrapper">
                                <i className="bi bi-calendar-event ob-input-icon" />
                                <select
                                    className={`ob-input ${errors?.publication_year ? 'has-error' : ''}`}
                                    {...register('publication_year', {
                                        required: 'Please select publication year.',
                                    })}>
                                    <option value="">Select year</option>
                                    {years && years.map((y, index) =>
                                        <option key={index + 'y'} value={y}>{y}</option>
                                    )}
                                </select>
                            </div>
                            {errors?.publication_year &&
                                <span className="ob-error">{errors.publication_year.message}</span>
                            }
                        </div>

                        <button
                            className="ob-submit-btn"
                            type="submit"
                            disabled={isContentLoading}>
                            {isContentLoading ? (
                                <span className="btn-spinner" />
                            ) : (
                                <>{modalShowWL === 'edit' ? 'Update' : 'Add to Wish List'}</>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default Wishlist;