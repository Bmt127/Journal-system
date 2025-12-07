import { useState } from "react";
import { searchApi } from "../../api/searchApi";
import { TextField, Button, Paper, Typography, CircularProgress } from "@mui/material";
import "./SearchStyles.css";

export default function PatientSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError("Ange sökterm.");
            setResults([]);
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const res = await searchApi.get(`/search/patients?query=${encodeURIComponent(query)}`);

            // Om backend returnerar ett objekt (ej array) -> supporta det defensivt
            const data = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);

            // KORREKT MAPPNING MOT BACKEND (DTO med firstName,lastName,email)
            const mapped = data.map(p => ({
                id: p.id,
                givenName: p.firstName || p.username || "",
                familyName: p.lastName || "",
                email: p.email || ""
            }));

            if (mapped.length === 0) {
                setError("Inga träffar.");
            } else {
                setError("");
            }

            setResults(mapped);
        } catch (err) {
            console.error("Search error:", err);
            setError("Kunde inte hitta patienter.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <Typography variant="h5" sx={{ mb: 2 }}>Sök patienter</Typography>

            <div className="search-bar" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <TextField
                    label="Namn eller diagnos"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                    fullWidth
                />
                <Button variant="contained" onClick={handleSearch} disabled={loading}>
                    {loading ? <CircularProgress size={20} /> : "Sök"}
                </Button>
            </div>

            {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                {results.map((p) => (
                    <Paper key={p.id} className="search-result-card" sx={{ padding: 2 }}>
                        <Typography variant="h6">
                            {p.givenName} {p.familyName}
                        </Typography>
                        <Typography><strong>ID:</strong> {p.id}</Typography>
                        <Typography><strong>Email:</strong> {p.email}</Typography>
                    </Paper>
                ))}
            </div>
        </div>
    );
}
