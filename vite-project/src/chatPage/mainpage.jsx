import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import "./mainpage.css";

const Mainpage = (props) => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);

    // Load old messages + listen for new messages
    useEffect(() => {

        // Get previous messages from MongoDB
        const loadMessages = async () => {
            try {
                const response = await axios.get(
                    "/messages"
                );

                const formattedMessages = response.data.map((item) => ({
                    username: item.message.senderName,
                    text: item.message.text,
                    sender:
                        item.message.senderName === props.username
                            ? "sent"
                            : "received",
                    time: new Date(item.message.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                }));

                setMessages(formattedMessages);

            } catch (error) {
                console.error("Error loading messages:", error);
            }
        };

        loadMessages();

        // New message received from Socket.IO
        const handleReceiveMessage = (data) => {
            console.log("Message received:", data);

            setMessages((prev) => [
                ...prev,
                {
                    username: data.senderName,
                    text: data.message,
                    sender:
                        data.senderName === props.username
                            ? "sent"
                            : "received",
                    time: new Date(data.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        };

        // Socket connection
        const handleConnect = () => {
            console.log("Connected to server:", socket.id);
        };

        const handleConnectError = (error) => {
            console.error("Socket connection error:", error);
        };

        const handleDisconnect = (reason) => {
            console.log("Socket disconnected:", reason);
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);

        // Cleanup
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("disconnect", handleDisconnect);
        };

    }, [props.username]);


    // Input handler
    const inputHandler = (e) => {
        setValue(e.target.value);
    };


    // Send message
    const sendMessage = () => {
        const message = value.trim();

        if (!message) return;

        if (!socket.connected) {
            console.log("Socket is not connected");
            return;
        }

        console.log("Sending message:", {
            sender: props.userId,
            senderName: props.username,
            message: message,
        });

        // Clear input
        setValue("");

        // Send to backend
        socket.emit("sendMessage", {
            sender: props.userId,
            senderName: props.username,
            message: message,
        });
    };


    // Enter key
    const enterKeyHandler = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };


    return (
        <div>
            <div className="chat-container">

                <div className="header">
                    <h2>Realtime Chat</h2>
                    <p>Online</p>
                </div>

                <div className="chat-box">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className={`message ${msg.sender}`}
                        >

                            <div className="username">
                                {msg.username}
                            </div>

                            <div className="bubble">
                                {msg.text}

                                <div className="time">
                                    {msg.time}
                                </div>
                            </div>

                        </div>

                    ))}

                </div>

                <div className="input-area">

                    <input
                        id="messageInput"
                        value={value}
                        onChange={inputHandler}
                        onKeyDown={enterKeyHandler}
                        type="text"
                        placeholder="Type a message..."
                    />

                    <button
                        className="send-button"
                        onClick={sendMessage}
                    >
                        Send
                    </button>

                </div>

            </div>
        </div>
    );
};

export default Mainpage;