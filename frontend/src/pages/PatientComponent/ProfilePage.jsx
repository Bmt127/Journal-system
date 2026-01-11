import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { Box, Typography } from "@mui/material";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        userApi.get("/users/me")
            .then(res => setUser(res.data))
            .catch(() => setError("Kunde inte hämta användardata"));
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!user) return <p>Laddar...</p>;

    return (
        <Box className="profilebox">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Min profil
            </Typography>

            <Typography sx={{ mb: 1 }}>
                <strong>ID:</strong> {user.id}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <strong>Användarnamn:</strong> {user.username}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <strong>Email:</strong> {user.email}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <strong>Roll:</strong> {user.role}
            </Typography>
        </Box>
    );
}
