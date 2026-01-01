import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { userApi } from "../../api/userApi";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import "./ConditionPage.css";

export default function ConditionPage() {
    const [patientId, setPatientId] = useState(null);
    const [conditions, setConditions] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState(null);

    // Hämta patientId via Keycloak-user
    useEffect(() => {
        userApi.get("/users/me")
            .then(res => {
                setPatientId(res.data.patientId);
            })
            .catch(() => {
                setError("Kunde inte hämta patient");
            });
    }, []);

    //Hämta conditions för patient
    useEffect(() => {
        if (!patientId) return;

        journalApi.get(`/conditions/patient/${patientId}`)
            .then(res => setConditions(res.data))
            .catch(() => setError("Kunde inte hämta tillstånd"));
    }, [patientId]);

    const selected = conditions.find(c => c.id === selectedId);

    return (
        <div className="condition-container">
            <h2 className="condition-header">Mina tillstånd</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <FormControl fullWidth className="condition-select">
                <InputLabel>Välj tillstånd</InputLabel>
                <Select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
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
