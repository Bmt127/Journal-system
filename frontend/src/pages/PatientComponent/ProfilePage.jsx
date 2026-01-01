import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { userApi } from "../../api/userApi";
import { Box, Typography } from "@mui/material";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    // 1. Hämta patientId via Keycloak-användare
    useEffect(() => {
        userApi.get("/users/me")
            .then(res => {
                const patientId = res.data.patientId;
                return journalApi.get(`/patients/${patientId}`);
            })
            .then(res => {
                setPatient(res.data);
            })
            .catch(() => {
                setError("Kunde inte hämta patientdata");
            });
    }, []);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!patient) {
        return <p>Laddar...</p>;
    }

    return (
        <Box className="profilebox">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Min profil
            </Typography>

            <Typography sx={{ mb: 1 }}>
                <strong>ID:</strong> {patient.id}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <strong>Användarnamn:</strong> {patient.username}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <strong>Email:</strong> {patient.email}
            </Typography>
        </Box>
    );
}
