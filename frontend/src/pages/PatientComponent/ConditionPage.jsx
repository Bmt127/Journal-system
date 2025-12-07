import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import "./ConditionPage.css";

export default function ConditionPage() {
    const [patient, setPatient] = useState(null);
    const [conditions, setConditions] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");

    // Hämta patient kopplad till user-account
    useEffect(() => {
        journalApi.get(`/patients/by-user/${userId}`)
            .then(res => setPatient(res.data))
            .catch(() => setError("Kunde inte hämta patient"));
    }, [userId]);

    // Hämta conditions för patient
    useEffect(() => {
        if (!patient?.id) return;

        journalApi.get(`/conditions/patient/${patient.id}`)
            .then(res => setConditions(res.data))
            .catch(() => setError("Kunde inte hämta tillstånd"));
    }, [patient]);

    const selected = conditions.find(c => c.id === selectedId);

    return (
        <div className="condition-container">
            <h2 className="condition-header">Mina tillstånd</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <FormControl fullWidth className="condition-select">
                <InputLabel>Välj tillstånd</InputLabel>
                <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                    {conditions.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.diagnosis}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selected && (
                <div className="condition-card">
                    <h3>{selected.diagnosis}</h3>
                    <p><strong>Anteckningar:</strong> {selected.notes || "Inga anteckningar"}</p>
                    <p><strong>Startdatum:</strong> {selected.onsetDate}</p>
                </div>
            )}
        </div>
    );
}
