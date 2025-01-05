import React, { useEffect, useRef, useState } from "react";
import { apiUrl, axiosInstance } from "../../axios/axios-config";
import { useOutletContext } from "react-router-dom";
import moment from "moment";
import Auth from "../../auth/Auth";
import axios from "axios";

const Chat = () => {

    const loggedUser = Auth.loggedInUser()
    const [chatList, setChatList] = useState([]);
    // const [messageScroll, setMessageScroll] = useState(0);
    const [selectedFile, setSelectedFile] = useState();
    const [inputValue, setInputValue] = useState("");
    const chatEndRef = useRef(null);
    const { selectedChannel } = useOutletContext()

    const [isScrolledUp, setIsScrolledUp] = useState(false); // Track if user scrolled up

    const sendMessage = async (filetype = 'text') => {
        if (!inputValue.trim() && !selectedFile) return; // Prevent sending empty messages

        const newMessage = {
            type: 'text',
            message: inputValue,
        };
        if (selectedFile) {
            const uploadedFileUrl = await FileUploadhandler(selectedFile, "file");
            if (uploadedFileUrl) {
                newMessage.message = uploadedFileUrl;
                newMessage.type = 'file';
            }
        }

        let APIUrl = `channel/${selectedChannel.id}/messages`
        console.log(newMessage);

        axiosInstance['post'](`${APIUrl}`, newMessage).then((res) => {
            if (res) {
                console.log('newMessagenewMessagenewMessage', newMessage);
                // Append the new message to the chat
                setChatList((prevMessages) => [
                    ...prevMessages,
                    { ...res.data, user: { name: loggedUser.name } },
                ]);

                setTimeout(() => { chatBoxScrollHandler() }, 100)
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

    const handleFileChange = (fileObject) => {
        const file = fileObject.target.files[0]
        if (file) {
            setSelectedFile()

            if (!validateFile(file)) {
                return;
            }

        }
    }

    const FileUploadhandler = async (file, uploadKeyName) => {

        const formData = new FormData()

        formData.append('type', uploadKeyName)
        formData.append('file', file)

        return axios.post(apiUrl + 'upload-image', formData).then((res) => {
            console.log(res);
            return res.data.image
            // upload_profile_image
        }).catch((error) => {

        });
    }

    const validateFile = (file) => {
        const allowedTypes = ["image/jpg", "image/png", "image/jpeg", "application/pdf"];
        const maxSize = 1 * 1024 * 1024; // 1MB
        console.log(file);

        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type. Only JPG, PNG, JPEG, and PDF are allowed.");
            return false;
        }
        console.log(maxSize);

        if (file.size > maxSize) {
            alert("File size exceeds the maximum limit of 1MB.");
            return false;
        }

        return true;
    };

    const messageDateTimeGet = (datetime) => {
        return moment(datetime).isSame(moment(), 'day')
            ? `Today ${moment(datetime).format('hh:mm a')}`
            : moment(datetime).format('DD/MM/YYYY hh:mm a')
    }


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
                                        <li key={index} className="mb-2 text-right">
                                            <div className="message other-message">{msg.message}</div>
                                            <div className="message-data text-right position-relative">
                                                <span className="message-user-name font-weight-bold">{msg.user?.name}</span>
                                                <span className="h6 position-absolute message-time right-time">
                                                    {messageDateTimeGet(msg.created_at)}
                                                </span>
                                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                            </div>

                                        </li>
                                        :
                                        // other user meesaage UI
                                        <li key={index} className="clearfix">
                                            <div className="message my-message">{msg.message}</div>
                                            <div className="message-data position-relative">

                                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                <span className="message-user-name">
                                                    {msg.user.name}
                                                </span>
                                                <span className="h6 position-absolute message-time left-time">
                                                    {messageDateTimeGet(msg.created_at)}
                                                </span>
                                            </div>

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
                        <div className="align-content-center">
                            <input
                                type="file"
                                accept="image/jpg, image/png, image/jpeg, application/pdf"
                                name="fileattached"
                                className="d-none"
                                id="fileattached"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="fileattached" className="hand mr-2 mb-0">
                                <i className='bx h4 bx-link'></i>
                            </label>
                        </div>
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