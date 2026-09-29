import { useState } from "react";
import api from "../../axios";
import "./login.css";

const Login = (props) => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const createUser = async () => {
        const name = username.trim();

        // Validate username
        if (!name) {
            setError("Please enter a username.");
            return;
        }

        try {
            setError("");

            // Create user in MongoDB
            const response = await api.post("/users", {
                name: name
            });

            console.log("Created user:", response.data);
            console.log("User ID:", response.data._id);

            // Store user information
            props.setUserId(response.data._id);
            props.setUsername(response.data.name);

            // Login only after user is successfully created
            props.setIsLoggedIn(true);

        } catch (error) {
            console.error("Error creating user:", error);

            setError(
                error.response?.data?.error ||
                "Unable to connect to server."
            );
        }
    };

    const handleLogin = () => {
        createUser();
    };

    return (
        <div>
            <div className="login-container">

                <div className="logo">
                    💬
                </div>

                <h2>Welcome</h2>

                <p className="subtitle">
                    Enter your username to join the chat
                </p>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <label htmlFor="username">
                    Username
                </label>

                <input
                    id="username"
                    type="text"
                    placeholder="e.g. Alex"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleLogin();
                        }
                    }}
                />

                <button
                    className="login-button"
                    onClick={handleLogin}
                >
                    Continue
                </button>

                <div className="footer">
                    Dummy authentication for demo purposes
                </div>

            </div>
        </div>
    );
};

export default Login;