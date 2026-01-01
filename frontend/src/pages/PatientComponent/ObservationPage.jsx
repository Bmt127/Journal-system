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

    useEffect(() => {
        let isMounted = true;

        userApi.get("/users/me")
            .then(res => {
                const pid = res.data?.patientId;
                if (!pid) throw new Error("patientId saknas");
                if (isMounted) setPatientId(pid);
            })
            .catch(err => {
                console.error(err);
                if (isMounted) setError("Kunde inte hämta patient");
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!patientId) return;

        let isMounted = true;

        journalApi.get(`/observations/patient/${patientId}`)
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : [];
                if (isMounted) setObservations(list);
            })
            .catch(err => {
                console.error(err);
                if (isMounted) setError("Kunde inte hämta observationer");
            });

        return () => {
            isMounted = false;
        };
    }, [patientId]);

    const safeObservations = Array.isArray(observations) ? observations : [];
    const selectedObs = safeObservations.find(o => String(o.id) === String(selectedId));

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
                    {safeObservations.map(o => (
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
