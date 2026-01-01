import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { userApi } from "../../api/userApi";
import {
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper
} from "@mui/material";
import "./ObservationPage.css";

export default function ObservationPage() {
    const [patientId, setPatientId] = useState(null);
    const [observations, setObservations] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState(null);

    // 1. Hämta patientId via Keycloak-användare
    useEffect(() => {
        userApi.get("/users/me")
            .then(res => {
                setPatientId(res.data.patientId);
            })
            .catch(() => {
                setError("Kunde inte hämta patient");
            });
    }, []);

    // 2. Hämta observationer för patient
    useEffect(() => {
        if (!patientId) return;

        journalApi.get(`/observations/patient/${patientId}`)
            .then(res => setObservations(res.data))
            .catch(() => setError("Kunde inte hämta observationer"));
    }, [patientId]);

    const selectedObs = observations.find(o => o.id === selectedId);

    return (
        <Box className="observation-container">
            <Typography className="observation-title">
                Mina observationer
            </Typography>

            {error && (
                <Typography color="error">
                    {error}
                </Typography>
            )}

            <FormControl className="observation-dropdown">
                <InputLabel>Välj observation</InputLabel>
                <Select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    {observations.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                            {o.value || "Observation"} — {o.observationDate}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedObs && (
                <Paper className="observation-card">
                    <Typography variant="h6">
                        Observation
                    </Typography>
                    <Typography>
                        <strong>Datum:</strong> {selectedObs.observationDate}
                    </Typography>
                    <Typography>
                        <strong>Anteckning:</strong>{" "}
                        {selectedObs.value || "Ingen anteckning"}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
