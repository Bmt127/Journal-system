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
    const [userId, setUserId] = useState(null);

    const endRef = useRef(null);

    // Hämta inloggad användare via token
    useEffect(() => {
        userApi.get("/users/me")
            .then(res => setUserId(res.data.id))
            .catch(() => setUserId(null));
    }, []);

    // Hämta alla användare
    useEffect(() => {
        userApi.get("/users")
            .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
            .catch(() => setUsers([]));
    }, []);

    const loadConversation = useCallback(async (otherUserId) => {
        if (!userId || !otherUserId) {
            setConversation([]);
            return;
        }

        try {
            const [sent, received] = await Promise.all([
                messageApi.get(`/messages/sender/${userId}`),
                messageApi.get(`/messages/receiver/${userId}`)
            ]);

            const sentArr = Array.isArray(sent.data) ? sent.data : [];
            const recvArr = Array.isArray(received.data) ? received.data : [];

            const all = [...sentArr, ...recvArr]
                .filter(m =>
                    Number(m.senderId) === Number(otherUserId) ||
                    Number(m.receiverId) === Number(otherUserId)
                )
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setConversation(all);
        } catch {
            setConversation([]);
        }
    }, [userId]);

    useEffect(() => {
        if (selectedUserId) {
            loadConversation(selectedUserId);
        }
    }, [selectedUserId, loadConversation]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const handleSend = async () => {
        if (!content.trim() || !selectedUserId || !userId) return;

        await messageApi.post("/messages", {
            senderId: userId,
            receiverId: Number(selectedUserId),
            content: content.trim()
        });

        setContent("");
        loadConversation(selectedUserId);
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
                        .filter(u => Number(u.id) !== Number(userId))
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
                        {conversation.map(m => (
                            <Paper
                                key={m.id}
                                className={`message-item ${
                                    Number(m.senderId) === Number(userId)
                                        ? "sent"
                                        : "received"
                                }`}
                            >
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {Number(m.senderId) === Number(userId)
                                        ? "Du"
                                        : getName(m.senderId)}
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
