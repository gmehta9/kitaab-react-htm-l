import { Container, Modal, Row } from "react-bootstrap";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

import '../../styles/chat.scss';
import '../../styles/onboarding.scss';
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axios-config";
import toast from "react-hot-toast";
import Auth from "../../auth/Auth";

function ChatLayout() {
    const navigate = useNavigate()
    const { setIsContentLoading } = useOutletContext()
    const [showModal, setShowModal] = useState(false);
    const [channelsList, setChannelsList] = useState()
    const [selectedChannel, setSelectedChannel] = useState();
    const [searchValue, setSearchValue] = useState();
    const [isChannelReadyTochat, setIsChannelReadyTochat] = useState();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const handleClose = useCallback(() => {
        setShowModal(false);
    }, [setShowModal]);

    const handleShow = useCallback(() => {
        setShowModal(true);
    }, [setShowModal]);

    const joinChannelListget = useCallback((chList) => {

        let APIUrl = `userChannel`
        setIsContentLoading(true)
        axiosInstance['get'](`${APIUrl}`).then((res) => {
            if (res) {
                let anyActiveChannel = false;

                const channelJoinlist = res.data; // This is the array of channels you joined
                const updatedChList = chList.map((ch) => {
                    // Check if the channel exists in channelJoinlist
                    const joinedChannel = channelJoinlist.find(joinedCh => joinedCh.channel_id === ch.id); // Assuming each channel has a unique 'id'

                    // If it exists, add the status from channelJoinlist to the channel object
                    if (joinedChannel) {
                        const updateChannel = {
                            ...ch,
                            status: joinedChannel.status // Assuming 'status' is the property you want to add
                        }

                        if (!anyActiveChannel && joinedChannel.status === 'active') {
                            anyActiveChannel = true
                            setIsChannelReadyTochat(true)
                            setSelectedChannel(updateChannel)
                        }
                        return updateChannel;
                    }

                    // If it doesn't exist, return the channel as is
                    return ch;
                });

                setChannelsList(updatedChList);
                setIsContentLoading(false);
            }
        }).catch((error) => {
            console.log(error)
        });
    }, [setIsContentLoading]);

    const getChannelsListHandler = useCallback(async () => {
        const params = {
            page: 1,
            size: 20,
        };
        let APIUrl = 'channel'
        setIsContentLoading(true)
        axiosInstance['get'](`${APIUrl}?${new URLSearchParams(params)}`).then((res) => {
            if (res) {
                joinChannelListget(res.data.data)

            }
        }).catch((error) => {
            console.log(error)
            setIsContentLoading(false)
        });
    }, [setIsContentLoading, joinChannelListget]);

    const generateColorFromId = (id) => {
        const str = String(id || '');
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const r = Math.abs(hash * 456) % 256;
        const g = Math.abs(hash * 789) % 256;
        const b = Math.abs(hash * 123) % 256;

        return `rgb(${r}, ${g}, ${b})`;
    };
    const joinChannelRequestHandler = useCallback(async () => {


        let APIUrl = `channel/${selectedChannel.id}/join`
        setIsContentLoading(true)
        axiosInstance['put'](`${APIUrl}`).then((res) => {
            if (res) {
                toast.success('Channel join request has been sent to the admin. Please wait for approval.')
                setIsContentLoading(false)
                handleClose()
            }
        }).catch((error) => {
            console.log(error)
            setIsContentLoading(false)
        });
    }, [selectedChannel, setIsContentLoading, handleClose]);

    useEffect(() => {
        if (!Auth.isUserAuthenticated()) {
            navigate('/')
            return
        }
        getChannelsListHandler()
    }, [navigate, getChannelsListHandler])

    return (
        <>
            <Row>
                <Container
                    fluid
                    style={{
                        minHeight: '30rem', // Fallback for small screens
                        height: 'calc(100vh - 180px)' // Full height on large screens (minus header + footer)
                    }}
                    className="inner-pages row border-top mx-auto chat-container-full-height">
                    <div className="row clearfix w-100">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                                <button
                                    className="mobile-menu-toggle d-lg-none"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    type="button">
                                    <i className={`bx ${isMobileMenuOpen ? 'bx-x' : 'bx-chat'}`}></i>
                                </button>
                                <div id="plist" className={`people-list ${isMobileMenuOpen ? 'open' : ''}`}>
                                    <div className="input-group channel-list-header">
                                        <h5 className="mb-0">Channels</h5>
                                    </div>
                                    <ul className="list-unstyled chat-list mt-2 mb-0">
                                        <input
                                            name=""
                                            type="search"
                                            placeholder="Search Channel"
                                            className="form-control mb-3"
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            id="search" />
                                        {channelsList && channelsList.map((cd, index) => {

                                            return ((!searchValue || new RegExp(`${searchValue}`, 'i').test(cd.name)) ?
                                                <li
                                                    key={index + 'id'}
                                                    className={`clearfix d-flex align-items-center pl-1
                                                        ${selectedChannel?.id === cd.id ? 'active' : ''}`}
                                                    onClick={() => {
                                                        if (cd.status === 'active') {
                                                            setIsChannelReadyTochat(true)
                                                        } else {
                                                            setIsChannelReadyTochat(false)
                                                            handleShow()
                                                        }
                                                        setSelectedChannel(cd)
                                                        setIsMobileMenuOpen(false)

                                                    }}>
                                                    <span
                                                        className="d-flex justify-content-center align-items-center rounded-circle"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            backgroundColor: `${generateColorFromId(cd.id)}` // Random background color
                                                        }}>
                                                        <span className="text-white">{cd.name.charAt(0)}</span> {/* Display the first letter of the channel name */}
                                                    </span>
                                                    {/* <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" /> */}
                                                    <div className="about">
                                                        <div className="name">{cd.name}</div>
                                                        {/* <div className="status">
                                                        <i className="fa fa-circle offline"></i>
                                                        left 7 mins ago
                                                        </div> */}
                                                    </div>
                                                </li>
                                                :
                                                (index === 0 &&
                                                    <div className="bg-light text-center mt-3">No channel Found!</div>
                                                )
                                            )
                                        })}
                                    </ul>
                                </div>
                                {isChannelReadyTochat ?

                                    <Outlet context={{ selectedChannel }} />
                                    :
                                    <div
                                        className="chat d-flex text-center align-items-center justify-content-center"
                                        style={{ minHeight: '500px' }}>
                                        <span>
                                            Select Channel
                                        </span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </Container>
                {/* <Footer /> */}
            </Row>

            <Modal
                centered
                show={showModal}
                onHide={handleClose}
                dialogClassName="onboarding-modal">
                <div className="modal-accent" />

                <button
                    onClick={handleClose}
                    className="modal-close-btn"
                    aria-label="Close">
                    <i className="bi bi-x-lg" />
                </button>

                <div className="onboarding-header">
                    <div className="brand-icon">
                        {selectedChannel?.status === 'pending'
                            ? <i className="bi bi-hourglass-split" style={{ color: '#f59e0b' }} />
                            : <i className="bi bi-people" style={{ color: '#019D5F' }} />
                        }
                    </div>
                    <h2>{selectedChannel?.status === 'pending' ? 'Request Pending' : 'Join Channel'}</h2>
                    <p>
                        {selectedChannel?.status === 'pending'
                            ? 'Your request has already been submitted. Please wait for admin approval.'
                            : <>Join <strong>{selectedChannel?.name}</strong> to start chatting</>
                        }
                    </p>
                </div>

                <div className="onboarding-body" style={{ paddingTop: 0 }}>
                    {selectedChannel?.status !== 'pending' && (
                        <button
                            className="ob-submit-btn"
                            onClick={joinChannelRequestHandler}
                            type="button">
                            <i className="bi bi-box-arrow-in-right me-1" /> Join Channel
                        </button>
                    )}
                </div>
            </Modal>
        </>
    )
}

export default ChatLayout;