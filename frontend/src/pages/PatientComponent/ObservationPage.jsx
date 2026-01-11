import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, Paper } from "@mui/material";
import "./ObservationPage.css";

export default function ObservationPage() {
    const [observations, setObservations] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState(null);

    // Hämta patientens egna observationer via Keycloak
    useEffect(() => {
        journalApi.get("/observations/me")
            .then(res => setObservations(res.data))
            .catch(() => setError("Kunde inte hämta observationer"));
    }, []);

    const selectedObs = observations.find(o => o.id === selectedId);

    return (
        <Box className="observation-container">
            <Typography className="observation-title">
                Mina observationer
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <FormControl className="observation-dropdown">
                <InputLabel>Välj observation</InputLabel>
                <Select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    {observations.map(o => (
                        <MenuItem key={o.id} value={o.id}>
                            {o.value || "Observation"} — {o.observationDate}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedObs && (
                <Paper className="observation-card">
                    <Typography variant="h6">Observation</Typography>
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
