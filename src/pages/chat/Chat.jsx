import { useState } from "react";

const Chat = () => {
    const [channel, setChannel] = useState()
    return (
        <>

            <div className="chat-header clearfix">
                <div className="row">
                    <div className="col-lg-6">
                        <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                        </a>
                        <div className="chat-about">
                            <h6 className="m-b-0">Channel Name</h6>

                        </div>
                    </div>

                </div>
            </div>
            <div className="chat-history">
                <ul className="m-b-0">

                    {/* left side message */}
                    <li className="clearfix">
                        <div className="message-data text-right position-relative">
                            <span className="message-user-name">
                                Gmehta right dfdffd gfdgdf
                            </span>
                            <span className="h6 position-absolute message-time right-time">
                                10:12 AM, Today
                            </span>
                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                        </div>
                        <div className="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                    </li>

                    {/* right side message */}
                    <li className="clearfix">
                        <div className="message-data position-relative">

                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                            <span className="message-user-name">
                                Gmehta dee mehta
                            </span>
                            <span className="h6 position-absolute message-time left-time">
                                10:12 AM, Today
                            </span>
                        </div>
                        <div className="message my-message">Are we meeting today?</div>
                    </li>

                </ul>
            </div>
            <div className="chat-message clearfix">
                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className='bx bx-send'></i>
                        </span>
                    </div>
                    <input type="text" className="form-control" placeholder="Enter text here..." />
                </div>
            </div>

        </>
    )
}

export default Chat;