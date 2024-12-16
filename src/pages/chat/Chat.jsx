import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../axios/axios-config";
import { useOutletContext } from "react-router-dom";
import moment from "moment";
import Auth from "../../auth/Auth";

const Chat = () => {

    const loggedUser = Auth.loggedInUser()
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const chatEndRef = useRef(null);
    const { selectedChannel } = useOutletContext()

    const sendMessage = async () => {
        if (!inputValue.trim()) return; // Prevent sending empty messages

        const newMessage = {
            type: "text",
            message: inputValue,
        };

        let APIUrl = `channel/${selectedChannel.id}/messages`

        axiosInstance['post'](`${APIUrl}`, newMessage).then((res) => {
            if (res) {
                // Append the new message to the chat
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { ...res.data, user: { name: loggedUser.name } },
                ]);
                setNewMessage(newMessage + 1)
                setInputValue(""); // Clear the input field
            }
        }).catch((error) => {
            console.log(error)
        });
    };

    console.log(loggedUser);

    const loadChannelChat = (page = 1) => {
        let APIUrl = `channel/${selectedChannel.id}/messages?page=${page}&size=50`
        axiosInstance['get'](`${APIUrl}`, newMessage).then((res) => {
            if (res) {
                console.log(res);
                setMessages(res.data.data)
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const generateColorFromId = (id) => {
        // Convert the ID to a number (assuming it's a string)
        const idNumber = parseInt(id, 10);

        // Generate RGB values based on the ID
        const r = (idNumber * 456) % 256; // Red component
        const g = (idNumber * 789) % 256; // Green component
        const b = (idNumber * 123) % 256; // Blue component

        return `rgb(${r}, ${g}, ${b})`;
    };

    useEffect(() => {
        // Scroll to the bottom of the chat when messages change
        if (newMessage) {
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 500);
        }
    }, [newMessage]);

    useEffect(() => {
        if (selectedChannel?.id) {
            loadChannelChat()
        }
    }, [selectedChannel])
    return (
        <>
            <div className="chat" >
                <div className="chat-header clearfix" style={{ borderColor: generateColorFromId(selectedChannel.id) }}>
                    <div className="row">
                        <div className="col-lg-6 d-flex align-items-center">
                            <span
                                className="d-flex justify-content-center align-items-center rounded-circle"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: `${generateColorFromId(selectedChannel.id)}`
                                }}>
                                <span className="text-white">{'c'}</span>
                            </span>
                            <div className="chat-about ">
                                <h6 className="mb-0">{selectedChannel.name}</h6>

                            </div>
                        </div>

                    </div>
                </div>
                <div className="chat-history">
                    <ul className="m-b-0">
                        {messages.map((msg, index) => (
                            <>
                                {msg.user_id === loggedUser.id ?
                                    <li key={index} className="clearfix">
                                        <div className="message-data text-right position-relative">
                                            <span className="message-user-name">{msg.user?.name}</span>
                                            <span className="h6 position-absolute message-time right-time">
                                                {moment(msg.created_at).format('HH:MM A')}
                                            </span>
                                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                        </div>
                                        <div className="message other-message float-right">{msg.message}</div>
                                    </li>
                                    :
                                    // other user meesaage UI
                                    <li className="clearfix">
                                        <div className="message-data position-relative">

                                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                            <span className="message-user-name">
                                                {msg.user.name}
                                            </span>
                                            <span className="h6 position-absolute message-time left-time">
                                                {moment(msg.created_at).format('HH:MM A')}
                                            </span>
                                        </div>
                                        <div className="message my-message">{msg.message}</div>
                                    </li>
                                }
                            </>
                        ))}
                    </ul>
                    <div ref={chatEndRef} />
                </div>
                <div className="chat-message clearfix">
                    <div className="input-group mb-0">
                        <input
                            type="text"
                            className="form-control"
                            style={{ minHeight: '60px' }}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter text here..." />
                        <div className="input-group-prepend">
                            <button
                                type="button"
                                onClick={sendMessage}
                                className="btn p-0 btn-primary send-btn border-0">
                                <span className="p-3">
                                    <i className='bx h4 mb-0 bx-send'></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat;