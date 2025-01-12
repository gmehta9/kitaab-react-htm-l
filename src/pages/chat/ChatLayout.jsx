import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

import '../../styles/chat.scss';
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
    const [isChannelReadyTochat, setIsChannelReadyTochat] = useState();


    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateColorFromId = (id) => {
        // Convert the ID to a number (assuming it's a string)
        const idNumber = parseInt(id, 10);

        // Generate RGB values based on the ID
        const r = (idNumber * 456) % 256; // Red component
        const g = (idNumber * 789) % 256; // Green component
        const b = (idNumber * 123) % 256; // Blue component

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChannel]);

    // userChannel

    const joinChannelListget = (chList) => {

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
    };

    useEffect(() => {
        getChannelsListHandler()
        if (!Auth.isUserAuthenticated()) {
            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Row>
                <Container fluid style={{ minHeight: '30rem' }} className="inner-pages row border-top mx-auto">
                    <div className="row clearfix w-100">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                                <div id="plist" className="people-list">
                                    <div className="input-group">
                                        Channels
                                    </div>
                                    <ul className="list-unstyled chat-list mt-2 mb-0">

                                        {channelsList && channelsList.map((cd, index) =>
                                            <li
                                                key={index + 'id'}
                                                className="clearfix d-flex align-items-center "
                                                onClick={() => {
                                                    if (cd.status === 'active') {
                                                        setIsChannelReadyTochat(true)
                                                    } else {
                                                        setIsChannelReadyTochat(false)
                                                        handleShow()
                                                    }
                                                    setSelectedChannel(cd)

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
                                        )}

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
                onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Join Channel</Modal.Title>
                    <Button
                        variant="close"
                        className="p-0"
                        onClick={handleClose}>
                        <i className='bx bx-x h2 mb-0'></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <div className="text-center">
                            {selectedChannel?.status === 'pending'
                                ? 'Your request to join the channel has already been submitted. Please wait for approval.'
                                : `Request to join ${selectedChannel?.name} channel.`}
                        </div>

                        {selectedChannel?.status !== 'pending' && (
                            <div className="text-center mt-3">
                                <Button
                                    variant="primary"
                                    className="mx-auto"
                                    onClick={joinChannelRequestHandler}
                                    type="button">
                                    Join
                                </Button>
                            </div>
                        )}
                        {/* <div className="text-center">
                            Request to join  {selectedChannel?.name} channel.
                        </div>

                        <div className="text-center mt-3">
                            <Button
                                variant="primary"
                                className="mx-auto"
                                onClick={joinChannelRequestHandler}
                                type="button">
                                Join
                            </Button>
                        </div>
                        */}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ChatLayout;