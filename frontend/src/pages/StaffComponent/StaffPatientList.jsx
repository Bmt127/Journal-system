import { useEffect, useState } from "react";
import { journalApi } from "../../api/journalApi";
import {
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
    Button,
    TextField
} from "@mui/material";
import "./PatientList.css";

export default function StaffPatientList() {
    const [patients, setPatients] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [error, setError] = useState(null);

    const [note, setNote] = useState("");
    const [showNoteForm, setShowNoteForm] = useState(false);

    const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("");
    const [onsetDate, setOnsetDate] = useState("");

    // Hämta alla patienter
    useEffect(() => {
        journalApi.get("/patients")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setPatients(
                    data.map(p => ({
                        id: p.id,
                        givenName: p.firstName || "",
                        familyName: p.lastName || ""
                    }))
                );
            })
            .catch(() => setError("Kunde inte hämta patienter"));
    }, []);

    // Hämta vald patient
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

    const handleAddNote = async () => {
        if (!note.trim() || !selectedId) return;

        await journalApi.post("/observations", {
            patientId: Number(selectedId),
            note: note.trim()
        });

        setNote("");
        setShowNoteForm(false);
    };

    const handleAddDiagnosis = async () => {
        if (!description || !severity || !onsetDate || !selectedId) return;

        await journalApi.post("/conditions", {
            patientId: Number(selectedId),
            diagnosis: description,
            notes: severity,
            onsetDate
        });

        setDescription("");
        setSeverity("");
        setOnsetDate("");
        setShowDiagnosisForm(false);
    };

    return (
        <Box className="patient-list-container">
            <Typography className="patient-list-title">
                Patienter
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <FormControl className="patient-list-dropdown">
                <InputLabel>Välj patient</InputLabel>
                <Select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    {patients.map(p => (
                        <MenuItem key={p.id} value={String(p.id)}>
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
                        <Button
                            variant="contained"
                            onClick={() => setShowNoteForm(v => !v)}
                        >
                            Lägg till notering
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setShowDiagnosisForm(v => !v)}
                        >
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
                            <Button
                                sx={{ mt: 1 }}
                                variant="contained"
                                onClick={handleAddNote}
                            >
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
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleAddDiagnosis}
                            >
                                Spara diagnos
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}
