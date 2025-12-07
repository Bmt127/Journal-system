import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { Box, Typography } from "@mui/material";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        journalApi.get(`/patients/by-user/${userId}`)
            .then(res => setPatient(res.data))
            .catch(() => setError("Kunde inte hämta patientdata"));
    }, [userId]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!patient) return <p>Laddar...</p>;

    return (
        <Box className="profilebox">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Min profil
            </Typography>

            <Typography sx={{ mb: 1 }}><strong>ID:</strong> {patient.id}</Typography>
            <Typography sx={{ mb: 1 }}><strong>Användarnamn:</strong> {patient.username}</Typography>
            <Typography sx={{ mb: 1 }}><strong>Email:</strong> {patient.email}</Typography>
        </Box>
    );
}
