import { useEffect, useState, useRef, useCallback } from "react";
import { userApi } from "../../api/userApi";
import { messageApi } from "../../api/messageApi";
import {
    TextareaAutosize,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    Paper
} from "@mui/material";
import "./MessagePage.css";

export default function MessagePage() {
    const [conversation, setConversation] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const userId = Number(localStorage.getItem("userId"));
    const messagesEndRef = useRef(null);

    // Hämta alla användare (för dropdown)
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await userApi.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Kunde inte hämta användare", err);
                setError("Kunde inte hämta användare");
            }
        };

        loadUsers();
    }, []);

    // Laddar konversationen (både skickade och mottagna)
    const loadConversation = useCallback(async (otherId) => {
        if (!otherId) {
            setConversation([]);
            return;
        }

        try {
            // Hämta både skickade och mottagna meddelanden för denna användare
            const [sentRes, recvRes] = await Promise.all([
                messageApi.get(`/messages/sender/${userId}`),
                messageApi.get(`/messages/receiver/${userId}`)
            ]);

            const combined = [...(sentRes.data || []), ...(recvRes.data || [])];

            // Filtrera ut endast meddelanden som rör selected user (antingen sender eller receiver)
            const conv = combined
                .filter(m =>
                    Number(m.senderId) === Number(otherId) ||
                    Number(m.receiverId) === Number(otherId)
                )
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setConversation(conv);
        } catch (err) {
            console.error("Kunde inte ladda konversation", err);
            setError("Kunde inte ladda konversation");
        }
    }, [userId]);

    // Kör när selectedUserId byter
    useEffect(() => {
        if (!selectedUserId) return;
        loadConversation(selectedUserId);
    }, [selectedUserId, loadConversation]);

    // Scrolla till botten när conversation uppdateras
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const handleSend = async () => {
        if (!content.trim() || !selectedUserId) return;

        try {
            await messageApi.post("/messages", {
                senderId: userId,
                receiverId: Number(selectedUserId),
                content: content.trim()
            });

            setContent("");
            // Ladda om konversation direkt efter sändning
            await loadConversation(selectedUserId);
        } catch (err) {
            console.error("Kunde inte skicka meddelande", err);
            setError("Kunde inte skicka meddelande");
        }
    };

    // Hjälpfunktion för att visa vem som skickade meddelandet
    const getSenderName = (senderId) => {
        if (Number(senderId) === Number(userId)) return "Du";
        const u = users.find(x => Number(x.id) === Number(senderId));
        if (!u) return "Okänd";
        return `${u.username} (${u.role})`;
    };

    return (
        <div className="message-container">
            <Typography variant="h5" sx={{ mb: 2 }}>Meddelanden</Typography>

            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Välj person</InputLabel>
                <Select
                    value={selectedUserId}
                    onChange={(e) => {
                        // Säkerställ att vi sätter ett nummer (eller tom sträng vid deselect)
                        const val = e.target.value;
                        setSelectedUserId(val === "" ? "" : Number(val));
                    }}
                >
                    {users
                        .filter(u => Number(u.id) !== Number(userId) && (u.role === "DOCTOR" || u.role === "STAFF"))
                        .map(u => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.username} ({u.role})
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

            {selectedUserId && (
                <>
                    <div className="message-list">
                        {conversation.length === 0 && (
                            <Typography variant="body2" sx={{ mb: 1 }}>Ingen konversation än.</Typography>
                        )}

                        {conversation.map(m => (
                            <Paper key={m.id} className={`message-item ${Number(m.senderId) === Number(userId) ? "sent" : "received"}`}>
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {getSenderName(m.senderId)}:
                                </Typography>
                                <Typography>{m.content}</Typography>
                                <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                                    {new Date(m.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <Paper sx={{ p: 2, mt: 2 }}>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Skriv ett meddelande..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="message-input"
                        />
                        <Button variant="contained" onClick={handleSend} sx={{ mt: 1 }}>
                            Skicka
                        </Button>
                    </Paper>
                </>
            )}
        </div>
    );
}
