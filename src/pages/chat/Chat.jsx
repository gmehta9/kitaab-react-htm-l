import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../axios/axios-config";
import { useOutletContext } from "react-router-dom";
import moment from "moment";
import Auth from "../../auth/Auth";

import { FileUploadhandler, MEDIA_URL, validateFile } from "../../helper/Utils";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Pusher from "pusher-js";

const Chat = () => {

    const pusher = new Pusher('1913596', {
        key: "75a9b0daeaeb0a75ba6b",
        cluster: 'ap2',
        encrypted: true,
    });


    const loggedUser = Auth.loggedInUser()
    const [chatList, setChatList] = useState([]);
    // const [messageScroll, setMessageScroll] = useState(0);
    const [selectedFile, setSelectedFile] = useState();
    const [selectFileImageView, setSelectFileImageView] = useState();
    const [newMessage, setNewMessage] = useState();
    const [isMsgSending, setIsMsgSending] = useState();
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const chatEndRef = useRef(null);
    const { selectedChannel } = useOutletContext()

    const [isScrolledUp, setIsScrolledUp] = useState(false); // Track if user scrolled up

    const sendMessage = async () => {
        if (!inputValue.trim() && !selectedFile) return; // Prevent sending empty messages

        const newMsg = {
            type: 'text',
            message: inputValue,
        };
        setIsMsgSending(true)
        if (selectedFile) {
            const uploadedFileUrl = await FileUploadhandler(selectedFile, "file");
            if (uploadedFileUrl) {
                newMsg.message = uploadedFileUrl;
                newMsg.type = selectedFile.type.startsWith('image/') ? 'image' : 'file';
            }
        }
        let APIUrl = `channel/${selectedChannel.id}/messages`
        axiosInstance['post'](`${APIUrl}`, newMsg).then((res) => {
            if (res) {

                // Append the new message to the chat
                setChatList((prevMessages) => [
                    ...prevMessages,
                    { ...res.data, user: { name: loggedUser.name } },
                ]);

                setTimeout(() => { chatBoxScrollHandler() }, 100)
                setInputValue(""); // Clear the input field
                setIsMsgSending(false)
                clearSelectFile()
                setNewMessage({
                    newMsg,
                    user: { name: loggedUser.name },
                    created_at: new Date().toISOString(),
                })

            }
        }).catch((error) => {
            setIsMsgSending(false)
            setSelectFileImageView()
            setSelectedFile()
            console.log(error)
        });
    };

    const loadChannelChat = (page = currentPage, loadMore) => {
        let APIUrl = `channel/${selectedChannel.id}/messages?page=${page}&size=20`
        axiosInstance['get'](`${APIUrl}`).then((res) => {
            if (res) {
                const reversedChats = [...res.data.data].reverse();
                if (loadMore) {
                    const newChatList = [...reversedChats, ...chatList,]
                    setChatList(newChatList);
                    // setChatList(prevChatList => [...prevChatList, ...reversedChats]);
                } else {
                    setChatList(reversedChats);
                }
                if (res.data.last_page === page) {
                    setIsLoadMore(false)
                } else {
                    setIsLoadMore(true)
                    setTimeout(() => { chatBoxScrollHandler() }, 500)
                }
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

    const messageUi = (msg) => {
        let mui;
        if (msg.type === 'text') {
            mui = <div className="message other-message">{msg.message}</div>;
        } else if (msg.type === 'file') {
            mui = (
                <div className="message other-message chat-file-msg">
                    <a
                        target="_blank"
                        href={MEDIA_URL + 'chatFiles/' + msg.message}
                        rel="noopener noreferrer"
                    >
                        <i style={{ fontSize: '50px' }} className="bx bxs-file-pdf" />
                    </a>
                </div>
            );
        } else if (msg.type === 'image') {
            mui = (
                <div className="message other-message chat-file-image">
                    <button type="button"
                        onClick={() => imagePreview(MEDIA_URL + 'chatFiles/' + msg.message, 'image', '')}
                        className="border-0 bg-transparent">

                        <img src={MEDIA_URL + 'chatFiles/' + msg.message} alt="chat-file-image" />
                    </button>
                </div>
            );
        }
        return mui;
    };

    const imagePreview = (src, type, caption) => {
        new Fancybox(
            [{
                src: src,
                type: type,
                caption: caption
            }],
            // Gallery options
            {
                hideScrollbar: false,
            }
        );
    }

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
            if (!validateFile(file, 'application/pdf')) {
                return;
            }

            setSelectedFile(file)
            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setSelectFileImageView(e.target.result); // Set the image preview URL
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            } else {
                setSelectFileImageView(null); // Clear the image preview if the file is not an image
            }
        }
    }

    const clearSelectFile = () => {
        setSelectFileImageView()
        setSelectedFile()
        const fileInput = document.getElementById('fileattached');
        fileInput.value = '';
    }

    const messageDateTimeGet = (datetime) => {
        return moment(datetime).isSame(moment(), 'day')
            ? `Today ${moment(datetime).format('hh:mm a')}`
            : moment(datetime).format('DD/MM/YYYY hh:mm a')
    }


    useEffect(() => {
        if (selectedChannel?.id) {
            loadChannelChat()
            const pusherChannel = pusher.subscribe(`channel-${selectedChannel.id}`);
            pusherChannel.bind('client-new-message', (data) => {
                console.log(data);

                // setChatList((prevMessages) => [...prevMessages, data]);
            });
            if (newMessage) {
                pusherChannel.trigger('client-new-message', newMessage);
            }
        }
    }, [selectedChannel, newMessage])



    useEffect(() => {
        return () => {
            pusher.unsubscribe(`channel-${selectedChannel.id}`);
        };
    }, [selectedChannel.id]);

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



                    <div className="chat-history position-relative" ref={chatEndRef}>
                        <ul className="m-b-0 ">
                            {isLoadMore &&
                                <div className="d-flex justify-content-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentPage(currentPage + 1)
                                            loadChannelChat(currentPage + 1, 'more')
                                        }}
                                        className="btn btn-secondary">
                                        load More
                                    </button>

                                </div>
                            }
                            {chatList.map((msg, index) => (
                                <React.Fragment key={index + 'chat'}>
                                    {msg.user_id === loggedUser.id ?
                                        <li key={index} className="mb-2 text-right">
                                            {messageUi(msg)}
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
                                            {messageUi(msg)}
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
                    {selectedFile &&
                        <div className="position-absolute  file-select-main w-100 bg-white p-2 border-1 border bottom-0 left-0 pl-4 pr-5">
                            <button
                                type="button"
                                onClick={clearSelectFile}
                                className="position-absolute right-0">
                                <i className='bx bx-x' />
                            </button>

                            <div className="d-flex">
                                {selectFileImageView ?
                                    <div className="image-preview-chat">
                                        <img src={selectFileImageView} alt="select file" />
                                    </div>
                                    :
                                    <i style={{ fontSize: '100px' }} className='bx bxs-file-pdf' />
                                }
                                <div className="file-name">
                                    {selectedFile.name}
                                </div>
                            </div>

                        </div>

                    }
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
                            disabled={selectedFile}
                            style={{ minHeight: '60px' }}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter text here..." />
                        <div className="input-group-prepend">

                            <button
                                type="button"
                                disabled={isMsgSending}
                                onClick={sendMessage}
                                className="btn p-0 btn-primary send-btn border-0">

                                <span className="p-3">
                                    {isMsgSending ?
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        :
                                        <i className='bx h4 mb-0 bx-send'></i>
                                    }
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