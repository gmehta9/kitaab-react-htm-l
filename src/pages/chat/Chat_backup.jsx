import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../axios/axios-config";
import { useOutletContext } from "react-router-dom";
import moment from "moment";
import Auth from "../../auth/Auth";

import { FileUploadhandler, getInitials, MEDIA_URL, validateFile } from "../../helper/Utils";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { ReplyIcon } from "../../components/ReplyIcon";
// Pusher.logToConsole = true;
const pusher = new Pusher('75a9b0daeaeb0a75ba6b', {
    // key: gagan.xeemu@gmail.com "75a9b0daeaeb0a75ba6b , gmehta.dev@gmail.com b8b88cde94e5cd3d31f7",
    cluster: 'ap2',
    encrypted: true,
});

const Chat = () => {

    const loggedUser = Auth.loggedInUser()
    const [chatList, setChatList] = useState([]);
    // const [messageScroll, setMessageScroll] = useState(0);
    const [selectedFile, setSelectedFile] = useState();
    const [selectFileImageView, setSelectFileImageView] = useState();
    // const [newMessage, setNewMessage] = useState();
    const [isMsgSending, setIsMsgSending] = useState();
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [replyMsgSelected, setReplyMsgSelected] = useState("");
    const chatEndRef = useRef(null);
    const { selectedChannel } = useOutletContext()

    const [isScrolledUp, setIsScrolledUp] = useState(false); // Track if user scrolled up

    const sendMessage = async () => {
        if (!inputValue.trim() && !selectedFile) return; // Prevent sending empty messages

        const newMsg = {
            type: 'text',
            message: inputValue,
        };
        if (replyMsgSelected) {
            newMsg.reply_to_message_id = replyMsgSelected?.id;
        }

        setIsMsgSending(true)
        if (selectedFile) {
            const uploadedFileUrl = await FileUploadhandler(selectedFile, "file");
            if (uploadedFileUrl) {
                newMsg.message = uploadedFileUrl;
                newMsg.type = selectedFile.type.startsWith('image/') ? 'image' : 'file';
            } else {
                clearSelectFile()
            }
        }
        let APIUrl = `channel/${selectedChannel.id}/messages`
        axiosInstance['post'](`${APIUrl}`, newMsg).then((res) => {
            if (res) {

                // Append the new message to the chat
                setChatList((prevMessages) => [
                    ...prevMessages,
                    {
                        ...res.data.message,
                        reply_to: res.data.reply_to,
                        user: { name: loggedUser.name }
                    },
                ]);

                setTimeout(() => { chatBoxScrollHandler() }, 100)
                setInputValue(""); // Clear the input field
                setIsMsgSending(false)
                clearSelectFile()
                setReplyMsgSelected(undefined)
                // setNewMessage({
                //     newMsg,
                //     user: { name: loggedUser.name },
                //     created_at: new Date().toISOString(),
                // })

            }
        }).catch((error) => {
            setIsMsgSending(false)
            setSelectFileImageView()
            setSelectedFile()
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
    const DeleteButton = (msg) => (
        <button type="button" style={{ left: '-45px' }} onClick={() => mesgDelethandler(msg)} className="btn-msg-delete position-absolute top-50 border-0 bg-transparent">
            <img src={`${process.env.REACT_APP_MEDIA_LOCAL_URL}delete_msg_.svg`} alt="" />
        </button>)
    const ReplyButton = (msg, whoseMsg) => (
        <button
            type="button"
            title="reply message"
            style={whoseMsg === 'mymsg' ? {
                left: '-25px',
                WebkitTransform: 'scaleX(-1)',
                transform: 'scaleX(-1)'
            } : { right: '-25px' }}
            onClick={() => setReplyMsgSelected(msg)}
            className="btn-msg-rply position-absolute top-50 border-0 bg-transparent">
            <ReplyIcon />
        </button>)

    const replyUi = (rplyMsg, whoseMsg) => {
        return <div
            style={
                whoseMsg === 'mymsg' ? {
                    background: '#c7dac8',
                    color: '#000',
                    fontSize: '12px',
                    marginLeft: '-8px',
                    lineHeight: '20px'
                } : {
                    background: '#007445',
                    color: '#fff',
                    fontSize: '12px',
                    marginRight: '-8px',
                    lineHeight: '20px'
                }}
            className="rounded px-2 text-left d-flex flex-column">
            <div className="font-weight-bold">
                {rplyMsg?.user?.name}
            </div>
            {rplyMsg.type === 'file' &&
                <>
                    <i style={{ fontSize: '50px' }} className="bx bxs-file" />
                </>
            }
            {rplyMsg.type === 'image' &&
                <>
                    <img style={{
                        width: '70px',
                        height: '70px',
                    }} src={MEDIA_URL + 'chatFiles/' + rplyMsg.message} alt="chat-file-image" />
                </>
            }
            {rplyMsg.type === 'text' &&
                <>
                    {rplyMsg?.message}
                </>
            }

        </div>
    }

    const messageUi = (msg, whoseMsg) => {
        let mui;
        if (msg.type === 'text') {
            mui = (
                <div className="chat-message">
                    {msg.reply_to && replyUi(msg.reply_to, whoseMsg)}
                    {ReplyButton(msg, whoseMsg)}
                    {whoseMsg === 'mymsg' && DeleteButton(msg)}
                    {msg.message}
                </div>
            );
        } else if (msg.type === 'file') {
            mui = (
                <div className="chat-message chat-file-msg">
                    {msg.reply_to && replyUi(msg.reply_to, whoseMsg)}
                    {ReplyButton(msg, whoseMsg)}
                    {whoseMsg === 'mymsg' && DeleteButton(msg)}
                    <a
                        target="_blank"
                        href={MEDIA_URL + 'chatFiles/' + msg.message}
                        rel="noopener noreferrer"
                    >
                        <i style={{ fontSize: '50px' }} className="bx bxs-file" />
                    </a>
                </div>
            );
        } else if (msg.type === 'image') {
            mui = (
                <div className="chat-message chat-file-image">
                    {msg.reply_to && replyUi(msg.reply_to, whoseMsg)}
                    {ReplyButton(msg, whoseMsg)}
                    {whoseMsg === 'mymsg' && DeleteButton(msg)}
                    <button type="button"
                        onClick={() => imagePreview(MEDIA_URL + 'chatFiles/' + msg.message, 'image', '')}
                        className="border-0 bg-transparent">

                        <img src={MEDIA_URL + 'chatFiles/' + msg.message} style={{
                            width: '60px',
                            height: '60px'
                        }} alt="chat-file-image" />
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

    const mesgDelethandler = (msg) => {

        if (window.confirm("Are you sure you want to delete this message?")) {
            let APIUrl = `channel/${selectedChannel.id}/message/${msg.id}/delete`
            axiosInstance['delete'](`${APIUrl}`).then((res) => {
                if (res) {
                    setChatList((prevMessages) => {
                        const updatedMessages = prevMessages.filter((message) => message.id !== msg.id);
                        return updatedMessages;
                    });
                    toast.success("Message deleted successfully")
                }
            }).catch((error) => {
                console.log(error)
            });
        }
    }

    const generateColorFromId = (id) => {
        // Convert the ID to a number (assuming it's a string)
        const idNumber = parseInt(id, 15);

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

            const allowedTypes = [
                "application/pdf",
                "application/msword", // .doc
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                "application/vnd.ms-excel", // .xls
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                "application/vnd.ms-powerpoint", // .ppt
                "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
                "text/plain", // .txt
                "application/zip", // .zip
            ];

            if (!validateFile(file, allowedTypes)) {
                clearSelectFile()
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
            const pusherChannel = pusher.subscribe(`channel-${selectedChannel.id}`);
            pusherChannel.bind('client-new-message', (data) => {
                if (data.user_id !== loggedUser.id && selectedChannel.id === +data.channel_id) {
                    // setChatList((prevMessages) => [...prevMessages, { ...data, user: { name: data.name } }]);
                    // setTimeout(() => { chatBoxScrollHandler() }, 100)
                    setChatList((prevMessages) => {
                        const isDuplicate = prevMessages.some(msg => msg.id === data.id);
                        if (!isDuplicate) {
                            return [...prevMessages, { ...data, user: { name: data.name } }];
                        }
                        return prevMessages;
                    });
                    setTimeout(() => { chatBoxScrollHandler() }, 100);
                }
            });
        }
    }, [selectedChannel])

    useEffect(() => {
        if (selectedChannel?.id) {
            loadChannelChat()
        }
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
            <div className="chat position-relative" >
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
                                        <li key={index} className="text-right my-message position-relative">
                                            {messageUi(msg, 'mymsg')}
                                            <div className="message-data text-right position-relative">
                                                <span className="message-user-name font-weight-bold mb-2 ">
                                                    {msg.user?.name}</span>
                                                <span className="h6 position-absolute message-time right-time">
                                                    {messageDateTimeGet(msg.created_at)}
                                                </span>
                                                <span
                                                    className="d-flex justify-content-center align-items-center rounded-circle chat-avatar-own"
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        backgroundColor: `${generateColorFromId(msg?.user?.id)}` // Random background color
                                                    }}>

                                                    <span className="text-white small d-flex text-center align-items-center">{
                                                        getInitials(msg?.user?.name)
                                                        // msg?.user?.name.charAt(0)
                                                    }</span>
                                                </span>

                                            </div>

                                        </li>
                                        :
                                        // other user meesaage UI
                                        <li key={index} className="clearfix client-msg other-user-message">
                                            {messageUi(msg, 'othermsg')}
                                            <div className="message-data position-relative">

                                                <span
                                                    className="d-flex justify-content-center align-items-center rounded-circle chat-avatar-other"
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        backgroundColor: `${generateColorFromId(msg?.user?.id)}` // Random background color
                                                    }}>
                                                    <span className="text-white small d-flex lh-1 align-items-center">{getInitials(msg?.user?.name)}</span>
                                                </span>

                                                <span className="message-user-name mb-2">
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
                    {(selectedFile || replyMsgSelected) &&

                        <div
                            style={{ width: '95%', maxHeight: '65px' }}
                            className="position-absolute file-select-main bg-white p-2 pt-3 shadow rounded border-1 border bottom-0 right-0 mr-4 translate-middle-x pl-4 pr-5 overflow-hidden">
                            {selectedFile && <>
                                <button
                                    type="button"
                                    onClick={clearSelectFile}
                                    style={{ height: '20px' }}
                                    className="position-absolute btn btn-danger w-auto p-0 right-0 mr-3">
                                    <i className='bx bx-x' />
                                </button>

                                <div className="d-flex">

                                    {selectFileImageView ?
                                        <div className="image-preview-chat">
                                            <img src={selectFileImageView} alt="select file" />
                                        </div>
                                        :
                                        <i style={{ fontSize: '30px' }} className='bx bxs-file' />
                                    }
                                    <div className="file-name">
                                        {selectedFile.name}
                                    </div>
                                </div>

                            </>
                            }

                            {replyMsgSelected && <>
                                <button
                                    type="button"
                                    style={{ height: '20px' }}
                                    onClick={() => setReplyMsgSelected(undefined)}
                                    className="position-absolute btn btn-danger w-auto p-0 right-0 mr-3">
                                    <i className='bx bx-x' />
                                </button>

                                <div className="d-flex flex-column position-relative">
                                    <div
                                        className="position-absolute left-0 top-0 font-weight-bold"
                                        style={{ marginTop: '-15px', fontSize: '12px' }}>
                                        Reply to:
                                    </div>
                                    <div className="file-name">
                                        {replyMsgSelected.message}
                                    </div>
                                </div>
                            </>}
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
                                accept="image/jpg, image/png, image/jpeg, application/*, application/zip"
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