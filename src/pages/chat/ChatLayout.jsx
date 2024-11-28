import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import '../../styles/chat.scss';
import { useState } from "react";

const ChannelData = [
    {
        title: 'Channel One'
    }
]
function ChatLayout() {
    const [showModal, setShowModal] = useState(false);
    const [channels, setChannels] = useState(ChannelData);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

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

                                        {ChannelData.map((cd, index) =>
                                            <li
                                                key={index + 'id'}
                                                className="clearfix"
                                                onClick={() => {
                                                    handleShow()
                                                    setChannels(cd)
                                                }}>
                                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                                <div className="about">
                                                    <div className="name">{cd.title}</div>
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