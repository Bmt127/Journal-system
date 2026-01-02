import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { userApi } from "../../api/userApi";
import { Box, Typography } from "@mui/material";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const token = keycloak.token;  // Hämta token från Keycloak

        if (!token) {
            console.error("Inget token tillgängligt.");
            setError("Inget token tillgängligt.");
            return;
        }

        // Skicka med tokenet i headern
        userApi.get("/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,  // Skicka med token i headern
            }
        })
            .then(res => {
                console.log("Användardata:", res.data); // Logga hela svaret för att se om patientId finns
                const patientId = res.data?.patientId;

                if (!patientId) {
                    throw new Error("patientId saknas på användaren");
                }

                // Anropa journalApi för att hämta patientdata
                return journalApi.get(`/patients/${patientId}`);
            })
            .then(res => {
                if (isMounted) {
                    setPatient(res.data);  // Sätt patientdata om den hämtades korrekt
                }
            })
            .catch(err => {
                console.error("ProfilePage error:", err);
                if (isMounted) {
                    setError("Kunde inte hämta patientdata");  // Sätt felmeddelande om något går fel
                }
            });

        return () => {
            isMounted = false;
        };
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
