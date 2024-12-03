import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import { Outlet, useOutletContext } from "react-router-dom";

import '../../styles/chat.scss';
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axios-config";

const ChannelData = [
    {
        title: 'Channel One'
    }
]
function ChatLayout() {
    const { setIsContentLoading } = useOutletContext()
    const [showModal, setShowModal] = useState(false);
    const [channelsList, setChannelsList] = useState()
    const [channels, setChannels] = useState(ChannelData);

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
                setIsContentLoading(false)
                setChannelsList(res.data.data)
            }
        }).catch((error) => {
            console.log(error)
            setIsContentLoading(false)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getChannelsListHandler()
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
                                                className="clearfix"
                                                onClick={() => {
                                                    handleShow()
                                                    setChannels(cd)
                                                }}>
                                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                                <div className="about">
                                                    <div className="name">{cd.name}</div>
                                                    <div className="status">
                                                        <i className="fa fa-circle offline"></i>
                                                        left 7 mins ago
                                                    </div>
                                                </div>
                                            </li>
                                        )}

                                    </ul>
                                </div>
                                <Outlet />
                            </div>
                        </div>
                    </div>

                </Container>
                {/* <Footer /> */}
            </Row>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton >
                    <Modal.Title>Join a Channel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <div className="text-center">
                            Request to join  {channels.title} channel.
                        </div>

                        <div className="text-center mt-3">
                            <Button
                                variant="primary"
                                className="mx-auto"
                                type="submit">
                                Join
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ChatLayout;