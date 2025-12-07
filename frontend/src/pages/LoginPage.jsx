import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import "./LoginPage.css";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await userApi.post("/users/login", { username, password });
            const user = res.data;

            // Spara korrekt info
            localStorage.setItem("userId", user.id);
            localStorage.setItem("role", user.role);

            if (user.role === "DOCTOR") {
                navigate("/doctor");
            } else if (user.role === "PATIENT") {
                navigate("/patient");
            } else if (user.role === "STAFF") {
                navigate("/staff");
            } else {
                alert("Okänd roll: " + user.role);
            }

        } catch (err) {
            console.error("Login failed:", err);
            alert("Fel användarnamn eller lösenord.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="outlined" type="submit">Log in</Button>
            </form>
        </div>
    );
}
