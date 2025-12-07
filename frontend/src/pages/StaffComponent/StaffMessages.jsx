import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../api/api";
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
import "./StaffMessages.css";

export default function StaffMessages() {
    const [conversation, setConversation] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const userId = Number(localStorage.getItem("userId"));
    const endRef = useRef(null);

    // Load all users
    useEffect(() => {
        api.get("/users")
            .then(res => setUsers(res.data))
            .catch(() => setError("Kunde inte hämta användare"));
    }, []);

    // Load conversation between staff and selected user
    const loadConversation = useCallback(async (otherId) => {
        if (!otherId) return;

        try {
            const [sent, received] = await Promise.all([
                api.get(`/messages/sender/${userId}`),
                api.get(`/messages/receiver/${userId}`)
            ]);

            const combined = [...sent.data, ...received.data];

            const conv = combined
                .filter(m =>
                    Number(m.senderId) === Number(otherId) ||
                    Number(m.receiverId) === Number(otherId)
                )
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setConversation(conv);

        } catch (err) {
            setError("Kunde inte ladda konversation");
        }
    }, [userId]);

    // Reload when user selected
    useEffect(() => {
        if (selectedUserId) loadConversation(selectedUserId);
    }, [selectedUserId, loadConversation]);

    // Auto scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const handleSend = async () => {
        if (!content.trim() || !selectedUserId) return;

        try {
            await api.post("/messages", {
                senderId: userId,
                receiverId: Number(selectedUserId),
                content: content.trim()
            });

            setContent("");
            loadConversation(selectedUserId);

        } catch {
            setError("Kunde inte skicka meddelande");
        }
    };

    const getSenderLabel = (senderId) => {
        if (Number(senderId) === Number(userId)) return "Du";

        const u = users.find(x => Number(x.id) === Number(senderId));
        return u ? `${u.username} (${u.role})` : "Okänd";
    };

    return (
        <div className="message-container">
            <Typography variant="h5" sx={{ mb: 2 }}>Meddelanden</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Välj person</InputLabel>
                <Select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                >
                    {users
                        .filter(u => Number(u.id) !== Number(userId)) // show all except current staff
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
                            <Typography variant="body2">Ingen konversation än.</Typography>
                        )}

                        {conversation.map(m => (
                            <Paper
                                key={m.id}
                                className={`message-item ${Number(m.senderId) === Number(userId) ? "sent" : "received"}`}
                            >
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {getSenderLabel(m.senderId)}:
                                </Typography>
                                <Typography>{m.content}</Typography>
                                <Typography variant="caption">
                                    {new Date(m.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))}

                        <div ref={endRef} />
                    </div>

                    <Paper sx={{ p: 2, mt: 2 }}>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Skriv ett meddelande..."
                            className="message-input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button variant="contained" sx={{ mt: 1 }} onClick={handleSend}>
                            Skicka
                        </Button>
                    </Paper>
                </>
            )}
        </div>
    );
}
