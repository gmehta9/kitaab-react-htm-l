import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../axios/axios-config";
import { useOutletContext } from "react-router-dom";
import moment from "moment";
import Auth from "../../auth/Auth";

const Chat = () => {

    const loggedUser = Auth.loggedInUser()
    const [chatList, setChatList] = useState([]);
    const [messageScroll, setMessageScroll] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const chatEndRef = useRef(null);
    const { selectedChannel } = useOutletContext()

    const [isScrolledUp, setIsScrolledUp] = useState(false); // Track if user scrolled up

    const sendMessage = async () => {
        if (!inputValue.trim()) return; // Prevent sending empty messages

        const newMessage = {
            type: "text",
            message: inputValue,
        };

        let APIUrl = `channel/${selectedChannel.id}/messages`

        axiosInstance['post'](`${APIUrl}`, newMessage).then((res) => {
            if (res) {
                console.log('newMessagenewMessagenewMessage', newMessage);
                // Append the new message to the chat
                setChatList((prevMessages) => [
                    ...prevMessages,
                    { ...res.data, user: { name: loggedUser.name } },
                ]);

                setMessageScroll(messageScroll + 1)
                setInputValue(""); // Clear the input field
            }
        }).catch((error) => {
            console.log(error)
        });
    };

    const loadChannelChat = (page = 1) => {
        let APIUrl = `channel/${selectedChannel.id}/messages?page=${page}&size=50`
        axiosInstance['get'](`${APIUrl}`).then((res) => {
            if (res) {
                setChatList(res.data.data.reverse())
                setTimeout(() => { chatBoxScrollHandler() }, 500)
                // setMessageScroll(messageScroll + 1)
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

    const chatBoxScrollHandler = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollTo({
                top: chatEndRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }

    const scrollToBottom = () => {
        setIsScrolledUp(false);
        chatBoxScrollHandler();
    };

    const handleScroll = () => {
        if (chatEndRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatEndRef.current;
            // Check if the user has scrolled up
            if ((scrollTop + clientHeight + 300) < scrollHeight) {
                setIsScrolledUp(true);
            } else {
                setIsScrolledUp(false);
            }
        }
    };


    useEffect(() => {
        if (selectedChannel?.id) {
            loadChannelChat()
        }
    }, [selectedChannel])

    useEffect(() => {
        const chatHistoryElement = chatEndRef.current;
        if (chatHistoryElement) {
            chatHistoryElement.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (chatHistoryElement) {
                chatHistoryElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

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
                <div className="position-relative">


                    <div className="chat-history " ref={chatEndRef}>
                        <ul className="m-b-0 ">
                            {chatList.map((msg, index) => (
                                <React.Fragment key={index + 'chat'}>
                                    {msg.user_id === loggedUser.id ?
                                        <li key={index} className="clearfix">
                                            <div className="message-data text-right position-relative">
                                                <span className="message-user-name">{msg.user?.name}</span>
                                                <span className="h6 position-absolute message-time right-time">
                                                    {moment(msg.created_at).format('hh:mm a')}
                                                </span>
                                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                            </div>
                                            <div className="message other-message float-right">{msg.message}</div>
                                        </li>
                                        :
                                        // other user meesaage UI
                                        <li key={index} className="clearfix">
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
                                </React.Fragment>
                            ))}
                        </ul>

                    </div>
                    {isScrolledUp && (
                        <button onClick={scrollToBottom} className=" btn btn-dark bottom-0 down-btn position-absolute">
                            <i className='bx bxs-down-arrow-circle'></i>
                        </button>
                    )}
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