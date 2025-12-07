import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { journalApi } from "../../api/journalApi";
import { Box, Typography } from "@mui/material";
import "./DoctorProfilePage.css";

export default function DoctorProfilePage() {
    const [doctor, setDoctor] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
            setError("Ingen användare inloggad");
            return;
        }

        async function load() {
            try {
                // 1. Hämta user
                const userRes = await userApi.get(`/users/${userId}`);
                setUser(userRes.data);

                const practitionerId = userRes.data.practitionerId;
                if (!practitionerId) {
                    setError("Ingen practitioner kopplad till användaren.");
                    return;
                }

                // 2. Hämta practitioner
                const pr = await journalApi.get(`/practitioners/${practitionerId}`);
                const p = pr.data;

                const givenName = p.firstName || "";
                const familyName = p.lastName || "";


                setDoctor({
                    givenName,
                    familyName,
                    raw: p
                });

            } catch (err) {
                console.error(err);
                setError("Kunde inte hämta läkarprofilen");
            }
        }

        load();
    }, [userId]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!doctor || !user) return <p>Laddar...</p>;

    return (
        <Box className="profilebox">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Min profil
            </Typography>

            <Typography sx={{ mb: 1 }}><strong>Förnamn:</strong> {doctor.givenName}</Typography>
            <Typography sx={{ mb: 1 }}><strong>Efternamn:</strong> {doctor.familyName}</Typography>
            <Typography sx={{ mb: 1 }}><strong>E-post:</strong> {user.email}</Typography>

            <Typography><strong>Roll:</strong> {user.role}</Typography>
        </Box>
    );
}
