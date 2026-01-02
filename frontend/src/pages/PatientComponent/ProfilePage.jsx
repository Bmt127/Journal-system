import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { userApi } from "../../api/userApi";
import {keycloak} from "../../keycloak";
import { Box, Typography } from "@mui/material";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!keycloak.token) {
            setError("Ej inloggad");
            return;
        }

        userApi.get("/users/me", {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
        })
            .then(res => {
                const patientId = res.data.patientId;
                if (!patientId) throw new Error("patientId saknas");

                return journalApi.get(`/patients/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                });
            })
            .then(res => setPatient(res.data))
            .catch(err => {
                console.error(err);
                setError("Kunde inte hämta patientdata");
            });
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!patient) return <p>Laddar...</p>;

    return (
        <Box className="profilebox">
            <Typography variant="h5">Min profil</Typography>
            <Typography>ID: {patient.id}</Typography>
            <Typography>Användarnamn: {patient.username}</Typography>
            <Typography>Email: {patient.email}</Typography>
        </Box>
    );
}
