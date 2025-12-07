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

export default function DoctorMessagePage() {
    const [conversation, setConversation] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [content, setContent] = useState("");

    const userId = Number(localStorage.getItem("userId"));
    const endRef = useRef(null);

    // Load all users
    useEffect(() => {
        userApi.get("/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Kunde inte hämta användare:", err));
    }, []);

    // Unified conversation loader
    const loadConversation = useCallback(async (otherUserId) => {
        if (!otherUserId) {
            setConversation([]);
            return;
        }

        try {
            const [sent, received] = await Promise.all([
                messageApi.get(`/messages/sender/${userId}`),
                messageApi.get(`/messages/receiver/${userId}`)
            ]);

            const all = [...sent.data, ...received.data]
                .filter(m =>
                    Number(m.senderId) === Number(otherUserId) ||
                    Number(m.receiverId) === Number(otherUserId)
                )
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setConversation(all);

        } catch (e) {
            console.error("Kunde inte hämta konversation:", e);
            setConversation([]);
        }
    }, [userId]);

    // Load conversation when user changes
    useEffect(() => {
        loadConversation(selectedUserId);
    }, [selectedUserId, loadConversation]);

    // Auto-scroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const handleSend = async () => {
        if (!content.trim() || !selectedUserId) return;

        try {
            await messageApi.post("/messages", {
                senderId: userId,
                receiverId: Number(selectedUserId),
                content: content.trim() // FIXED
            });

            setContent("");
            await loadConversation(selectedUserId);

        } catch (err) {
            console.error("Kunde inte skicka meddelande:", err);
            alert("Kunde inte skicka meddelande.");
        }
    };

    const getName = (id) => {
        const u = users.find(u => Number(u.id) === Number(id));
        return u ? `${u.username} (${u.role})` : "Okänd användare";
    };

    return (
        <div className="message-container">
            <Typography variant="h5" sx={{ mb: 2 }}>
                Meddelanden
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Välj person</InputLabel>
                <Select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                >
                    {users
                        .filter(u => u.id !== userId)
                        .map(u => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.username} ({u.role})
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

            {selectedUserId ? (
                <>
                    <div className="message-list">
                        {conversation.length === 0 && (
                            <Typography>Ingen konversation ännu</Typography>
                        )}

                        {conversation.map((m) => (
                            <Paper
                                key={m.id}
                                className={`message-item ${
                                    Number(m.senderId) === userId ? "sent" : "received"
                                }`}
                            >
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {Number(m.senderId) === userId ? "Du" : getName(m.senderId)}:
                                </Typography>

                                <Typography>{m.content}</Typography>

                                <Typography
                                    variant="caption"
                                    sx={{ mt: 1, display: "block" }}
                                >
                                    {m.timestamp
                                        ? new Date(m.timestamp).toLocaleString()
                                        : ""}
                                </Typography>
                            </Paper>
                        ))}

                        <div ref={endRef} />
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
            ) : (
                <Typography>Välj en person för att se konversationen</Typography>
            )}
        </div>
    );
}
