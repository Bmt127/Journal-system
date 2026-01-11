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
            const params = {};

            // Om användaren skriver "diag:diabetes" → sök på condition
            if (query.toLowerCase().startsWith("diag:")) {
                params.condition = query.substring(5).trim();
            } else {
                params.query = query;
            }

            const res = await searchApi.get("/search/patients", { params });

            const data = Array.isArray(res.data) ? res.data : [];

            const mapped = data.map(p => ({
                id: p.id,
                givenName: p.firstName || "",
                familyName: p.lastName || "",
                email: p.email || ""
            }));

            if (mapped.length === 0) {
                setError("Inga träffar.");
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
            <Typography variant="h5" sx={{ mb: 2 }}>
                Sök patienter
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
                Tips: skriv <b>diag:diabetes</b> för att söka på diagnos
            </Typography>

            <div className="search-bar" style={{ display: "flex", gap: 8 }}>
                <TextField
                    label="Namn eller diagnos"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    fullWidth
                />
                <Button variant="contained" onClick={handleSearch} disabled={loading}>
                    {loading ? <CircularProgress size={20} /> : "Sök"}
                </Button>
            </div>

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                {results.map(p => (
                    <Paper key={p.id} sx={{ padding: 2 }}>
                        <Typography variant="h6">
                            {p.givenName} {p.familyName}
                        </Typography>
                        <Typography>ID: {p.id}</Typography>
                        <Typography>Email: {p.email}</Typography>
                    </Paper>
                ))}
            </div>
        </div>
    );
}
