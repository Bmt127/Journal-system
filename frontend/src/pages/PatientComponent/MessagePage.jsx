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
    const [userId, setUserId] = useState(null);

    const messagesEndRef = useRef(null);

    // Hämta inloggad användare korrekt (inte från localStorage)
    useEffect(() => {
        userApi.get("/users/me")
            .then(res => {
                setUserId(res.data.id);
            })
            .catch(err => {
                console.error(err);
                setError("Kunde inte hämta inloggad användare");
            });
    }, []);

    // Hämta alla användare
    useEffect(() => {
        userApi.get("/users")
            .then(res => {
                setUsers(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error(err);
                setError("Kunde inte hämta användare");
            });
    }, []);

    const loadConversation = useCallback(async (otherId) => {
        if (!userId || !otherId) {
            setConversation([]);
            return;
        }

        try {
            const [sentRes, recvRes] = await Promise.all([
                messageApi.get(`/messages/sender/${userId}`),
                messageApi.get(`/messages/receiver/${userId}`)
            ]);

            const sent = Array.isArray(sentRes.data) ? sentRes.data : [];
            const recv = Array.isArray(recvRes.data) ? recvRes.data : [];

            const conv = [...sent, ...recv]
                .filter(m =>
                    Number(m.senderId) === Number(otherId) ||
                    Number(m.receiverId) === Number(otherId)
                )
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setConversation(conv);
        } catch (err) {
            console.error(err);
            setError("Kunde inte ladda konversation");
        }
    }, [userId]);

    useEffect(() => {
        if (selectedUserId) {
            loadConversation(selectedUserId);
        }
    }, [selectedUserId, loadConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const handleSend = async () => {
        if (!content.trim() || !selectedUserId || !userId) return;

        try {
            await messageApi.post("/messages", {
                senderId: userId,
                receiverId: selectedUserId,
                content: content.trim()
            });

            setContent("");
            await loadConversation(selectedUserId);
        } catch (err) {
            console.error(err);
            setError("Kunde inte skicka meddelande");
        }
    };

    const getSenderName = (senderId) => {
        if (Number(senderId) === Number(userId)) return "Du";
        const u = users.find(x => Number(x.id) === Number(senderId));
        return u ? `${u.username} (${u.role})` : "Okänd";
    };

    return (
        <div className="message-container">
            <Typography variant="h5" sx={{ mb: 2 }}>Meddelanden</Typography>

            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Välj person</InputLabel>
                <Select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                >
                    {users
                        .filter(u =>
                            Number(u.id) !== Number(userId) &&
                            (u.role === "DOCTOR" || u.role === "STAFF")
                        )
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
                                    {getSenderName(m.senderId)}:
                                </Typography>
                                <Typography>{m.content}</Typography>
                                <Typography variant="caption">
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
