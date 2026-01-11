import { useEffect, useState } from "react";
import { searchApi } from "../../api/searchApi";
import { Paper, Button, Typography, CircularProgress } from "@mui/material";
import "./SearchStyles.css";

export default function PractitionerSearch() {
    const [practitioners, setPractitioners] = useState([]);
    const [selected, setSelected] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loadingPract, setLoadingPract] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [error, setError] = useState("");

    /* -------------------------
       Load all practitioners
    ------------------------- */
    useEffect(() => {
        setLoadingPract(true);
        searchApi.get("/search/practitioners")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setPractitioners(data);
                setError("");
            })
            .catch(err => {
                console.error("Kunde inte hämta vårdpersonal:", err);
                setError("Kunde inte hämta vårdpersonal.");
            })
            .finally(() => setLoadingPract(false));
    }, []);

    /* -------------------------
       Load patients for practitioner
    ------------------------- */
    const loadPatients = async (id) => {
        setSelected(id);
        setPatients([]);
        setLoadingPatients(true);
        setError("");

        try {
            const res = await searchApi.get(`/search/practitioners/${id}/patients`);
            const data = Array.isArray(res.data) ? res.data : [];
            setPatients(data);
        } catch (err) {
            console.error("Kunde inte hämta kopplade patienter:", err);
            setError("Kunde inte hämta kopplade patienter.");
        } finally {
            setLoadingPatients(false);
        }
    };

    /* -------------------------
       Render
    ------------------------- */
    return (
        <div className="search-container">
            <Typography variant="h5" sx={{ mb: 2 }}>
                Vårdpersonal
            </Typography>

            {loadingPract && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}

            <div className="practitioner-list" style={{ display: "grid", gap: 12 }}>
                {practitioners.map(p => (
                    <Paper
                        key={p.id}
                        className={`search-result-card ${selected === p.id ? "active" : ""}`}
                        sx={{ padding: 2 }}
                    >
                        <Typography variant="h6">
                            {p.firstName} {p.lastName}
                        </Typography>

                        <Typography>ID: {p.id}</Typography>
                        <Typography>Email: {p.email}</Typography>

                        <Button
                            sx={{ mt: 1 }}
                            variant="outlined"
                            onClick={() => loadPatients(p.id)}
                        >
                            {selected === p.id && loadingPatients
                                ? <CircularProgress size={18} />
                                : "Visa patienter"}
                        </Button>
                    </Paper>
                ))}
            </div>

            {selected && (
                <div className="patient-result-section" style={{ marginTop: 16 }}>
                    <Typography variant="h6">
                        Patienter kopplade till denna vårdgivare
                    </Typography>

                    {!loadingPatients && patients.length === 0 &&
                        <Typography>Inga patienter funna.</Typography>
                    }

                    {patients.map(pt => (
                        <Paper key={pt.id} sx={{ padding: 2, mt: 1 }}>
                            <Typography variant="body1">
                                {pt.firstName} {pt.lastName}
                            </Typography>
                            <Typography>ID: {pt.id}</Typography>
                            <Typography>Email: {pt.email}</Typography>
                        </Paper>
                    ))}
                </div>
            )}
        </div>
    );
}
