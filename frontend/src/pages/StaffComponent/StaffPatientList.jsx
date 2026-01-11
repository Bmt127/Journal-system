import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import { userApi } from "../../api/userApi";
import {
    Box, Typography, MenuItem, Select, FormControl, InputLabel,
    Paper, Button, TextField
} from "@mui/material";
import "./PatientList.css";

export default function StaffPatientList() {
    const [user, setUser] = useState(null);

    const [patients, setPatients] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [error, setError] = useState(null);

    const [note, setNote] = useState("");
    const [showNoteForm, setShowNoteForm] = useState(false);

    const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("");
    const [onsetDate, setOnsetDate] = useState("");

    /* -------------------------
       Load logged in staff
    ------------------------- */
    useEffect(() => {
        async function load() {
            try {
                const userRes = await userApi.get("/users/me");
                const u = userRes.data;
                setUser(u);

                if (u.role !== "STAFF" && u.role !== "DOCTOR") {
                    setError("Åtkomst nekad");
                    return;
                }

                const res = await journalApi.get("/patients");
                const mapped = res.data.map(p => ({
                    id: p.id,
                    givenName: p.firstName || "",
                    familyName: p.lastName || ""
                }));
                setPatients(mapped);

            } catch (err) {
                console.error(err);
                setError("Kunde inte ladda data");
            }
        }

        load();
    }, []);

    /* -------------------------
       Load selected patient
    ------------------------- */
    useEffect(() => {
        if (!selectedId) {
            setSelectedPatient(null);
            return;
        }

        journalApi.get(`/patients/${selectedId}`)
            .then(res => {
                const p = res.data;
                setSelectedPatient({
                    id: p.id,
                    givenName: p.firstName || "",
                    familyName: p.lastName || ""
                });
            })
            .catch(() => setError("Kunde inte hämta patient"));
    }, [selectedId]);

    /* -------------------------
       Add note
    ------------------------- */
    const handleAddNote = async () => {
        if (!note.trim()) return alert("Skriv en notering");
        if (!selectedId) return alert("Ingen patient vald");

        try {
            await journalApi.post("/observations", {
                patientId: selectedId,
                note
            });
            setNote("");
            setShowNoteForm(false);
            alert("Notering tillagd");
        } catch (err) {
            console.error(err);
            alert("Kunde inte spara notering");
        }
    };

    /* -------------------------
       Add diagnosis
    ------------------------- */
    const handleAddDiagnosis = async () => {
        if (!description || !severity || !onsetDate) {
            alert("Fyll i alla fält");
            return;
        }

        try {
            await journalApi.post("/conditions", {
                patientId: selectedId,
                diagnosis: description,
                notes: severity,
                onsetDate
            });

            setDescription("");
            setSeverity("");
            setOnsetDate("");
            setShowDiagnosisForm(false);
            alert("Diagnos sparad");
        } catch (err) {
            console.error(err);
            alert("Kunde inte spara diagnos");
        }
    };

    /* -------------------------
       Render
    ------------------------- */
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!user) return <p>Laddar...</p>;

    return (
        <Box className="patient-list-container">
            <Typography className="patient-list-title">Patienter</Typography>

            <FormControl className="patient-list-dropdown">
                <InputLabel>Välj patient</InputLabel>
                <Select
                    value={selectedId || ""}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    {patients.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.givenName} {p.familyName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedPatient && (
                <Paper className="patient-card">
                    <Typography variant="h6">
                        {selectedPatient.givenName} {selectedPatient.familyName}
                    </Typography>

                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                        <Button variant="contained" onClick={() => setShowNoteForm(!showNoteForm)}>
                            Lägg till notering
                        </Button>
                        <Button variant="outlined" onClick={() => setShowDiagnosisForm(!showDiagnosisForm)}>
                            Fastställ diagnos
                        </Button>
                    </Box>

                    {showNoteForm && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                multiline
                                fullWidth
                                minRows={3}
                                label="Notering"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <Button sx={{ mt: 1 }} variant="contained" onClick={handleAddNote}>
                                Spara notering
                            </Button>
                        </Box>
                    )}

                    {showDiagnosisForm && (
                        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Beskrivning"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <TextField
                                label="Anteckningar"
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                            />
                            <TextField
                                type="date"
                                label="Startdatum"
                                InputLabelProps={{ shrink: true }}
                                value={onsetDate}
                                onChange={(e) => setOnsetDate(e.target.value)}
                            />

                            <Button variant="contained" onClick={handleAddDiagnosis}>
                                Spara
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}
