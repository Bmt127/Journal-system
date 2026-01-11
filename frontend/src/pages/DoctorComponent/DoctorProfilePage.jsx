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

                if (u.role !== "DOCTOR") {
                    setError("Du är inte inloggad som läkare.");
                    return;
                }

                if (!u.practitionerId) {
                    setError("Ingen practitioner är kopplad till ditt konto.");
                    return;
                }

                // 2. Hämta practitioner från journal-service
                const pr = await journalApi.get(`/practitioners/${u.practitionerId}`);
                const p = pr.data;

                setDoctor({
                    givenName: p.firstName || "",
                    familyName: p.lastName || ""
                });

            } catch (err) {
                console.error(err);
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

            <Typography><strong>Förnamn:</strong> {doctor.givenName}</Typography>
            <Typography><strong>Efternamn:</strong> {doctor.familyName}</Typography>
            <Typography><strong>E-post:</strong> {user.email}</Typography>
            <Typography><strong>Roll:</strong> {user.role}</Typography>
        </Box>
    );
}
