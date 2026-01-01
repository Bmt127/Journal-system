import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { journalApi } from "../../api/journalApi";
import { Box, Typography } from "@mui/material";
import "./DoctorProfilePage.css";

export default function DoctorProfilePage() {
    const [doctor, setDoctor] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                // 1. Hämta inloggad användare via token
                const userRes = await userApi.get("/users/me");
                const u = userRes.data;
                setUser(u);

                const practitionerId = u.practitionerId;
                if (!practitionerId) {
                    setError("Ingen practitioner kopplad till användaren");
                    return;
                }

                // 2. Hämta practitioner
                const prRes = await journalApi.get(`/practitioners/${practitionerId}`);
                const p = prRes.data;

                setDoctor({
                    givenName: p.firstName || "",
                    familyName: p.lastName || ""
                });
            } catch (e) {
                setError("Kunde inte hämta läkarprofilen");
            }
        }

        load();
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!doctor || !user) return <p>Laddar...</p>;

    return (
        <Box className="profilebox">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Min profil
            </Typography>

            <Typography sx={{ mb: 1 }}>
                <strong>Förnamn:</strong> {doctor.givenName}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <strong>Efternamn:</strong> {doctor.familyName}
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <strong>E-post:</strong> {user.email}
            </Typography>
            <Typography>
                <strong>Roll:</strong> {user.role}
            </Typography>
        </Box>
    );
}
