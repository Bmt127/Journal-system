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

    useEffect(() => {
        setLoadingPract(true);
        searchApi.get("/search/practitioners")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
                const mapped = data.map(p => {
                    const name = (p.firstName || "") + (p.lastName ? " " + p.lastName : "");
                    let givenName = "", familyName = "";
                    if (name.trim()) {
                        const parts = name.trim().split(" ");
                        givenName = parts.slice(0, -1).join(" ");
                        familyName = parts.slice(-1).join(" ");
                    } else {
                        givenName = p.username || "";
                    }
                    return {
                        id: p.id,
                        givenName,
                        familyName
                    };
                });
                setPractitioners(mapped);
                setError("");
            })
            .catch(err => {
                console.error("Kunde inte hämta vårdpersonal:", err);
                setError("Kunde inte hämta vårdpersonal.");
            })
            .finally(() => setLoadingPract(false));
    }, []);

    const loadPatients = async (id) => {
        setSelected(id);
        setPatients([]);
        setLoadingPatients(true);
        setError("");

        try {
            const res = await searchApi.get(`/search/practitioners/${id}/patients`);
            const data = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
            const mapped = data.map(pt => {
                const name = (pt.firstName || "") + (pt.lastName ? " " + pt.lastName : "");
                let givenName = "", familyName = "";
                if (name.trim()) {
                    const parts = name.trim().split(" ");
                    givenName = parts.slice(0, -1).join(" ");
                    familyName = parts.slice(-1).join(" ");
                } else {
                    givenName = pt.username || "";
                }
                return {
                    id: pt.id,
                    givenName,
                    familyName
                };
            });
            setPatients(mapped);
        } catch (err) {
            console.error("Kunde inte hämta kopplade patienter:", err);
            setError("Kunde inte hämta kopplade patienter.");
        } finally {
            setLoadingPatients(false);
        }
    };

    return (
        <div className="search-container">
            <Typography variant="h5" sx={{ mb: 2 }}>Sök vårdpersonal</Typography>

            {loadingPract ? <CircularProgress /> : null}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="practitioner-list" style={{ display: "grid", gap: 12 }}>
                {practitioners.map((p) => (
                    <Paper
                        key={p.id}
                        className={`search-result-card ${selected === p.id ? "active" : ""}`}
                        sx={{ padding: 2 }}
                    >
                        <Typography variant="h6">{p.givenName} {p.familyName}</Typography>
                        <Typography><strong>ID:</strong> {p.id}</Typography>

                        <Button sx={{ mt: 1 }} variant="outlined" onClick={() => loadPatients(p.id)}>
                            {selected === p.id && loadingPatients ? <CircularProgress size={18} /> : "Visa patienter"}
                        </Button>
                    </Paper>
                ))}
            </div>

            {selected && (
                <div className="patient-result-section" style={{ marginTop: 16 }}>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                        Patienter kopplade till denna vårdgivare
                    </Typography>

                    {patients.length === 0 && !loadingPatients && <Typography>Inga patienter funna.</Typography>}

                    {patients.map((pt) => (
                        <Paper key={pt.id} className="search-result-card" sx={{ padding: 2, mt: 1 }}>
                            <Typography>{pt.givenName} {pt.familyName}</Typography>
                            <Typography>ID: {pt.id}</Typography>
                        </Paper>
                    ))}
                </div>
            )}
        </div>
    );
}
