import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, Paper } from "@mui/material";
import "./ObservationPage.css";

export default function ObservationPage() {
    const [patient, setPatient] = useState(null);
    const [observations, setObservations] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");

    // Hämta patient utifrån userId
    useEffect(() => {
        journalApi.get(`/patients/by-user/${userId}`)
            .then(res => setPatient(res.data))
            .catch(() => setError("Kunde inte hämta patient"));
    }, [userId]);

    // Hämta observationer
    useEffect(() => {
        if (!patient?.id) return;

        journalApi.get(`/observations/patient/${patient.id}`)
            .then(res => setObservations(res.data))
            .catch(() => setError("Kunde inte hämta observationer"));
    }, [patient]);

    const selectedObs = observations.find(o => o.id === selectedId);

    return (
        <Box className="observation-container">
            <Typography className="observation-title">Mina observationer</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <FormControl className="observation-dropdown">
                <InputLabel>Välj observation</InputLabel>
                <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                    {observations.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                            {o.value || "Observation"} — {o.observationDate}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedObs && (
                <Paper className="observation-card">
                    <Typography variant="h6">Observation</Typography>
                    <Typography><strong>Datum:</strong> {selectedObs.observationDate}</Typography>
                    <Typography>
                        <strong>Anteckning:</strong> {selectedObs.value || "Ingen anteckning"}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
